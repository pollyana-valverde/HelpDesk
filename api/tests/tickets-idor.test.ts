import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../src/configs/auth'
import { generateUniqueEmail } from './helpers'

describe('Tickets IDOR - GET /tickets/:id/show-detail', () => {
  let clientToken: string
  let otherClientToken: string
  let expertToken: string
  let otherExpertToken: string
  let adminToken: string
  let ticketId: string

  beforeEach(async () => {
    const hashedPassword = await hash('password123', 8)
    const secret = String(authConfig.jwt.secret)

    const client = await prisma.user.create({
      data: { name: 'Client Owner', email: generateUniqueEmail('client'), password: hashedPassword, role: 'client', availableHours: [] },
    })
    const otherClient = await prisma.user.create({
      data: { name: 'Other Client', email: generateUniqueEmail('other-client'), password: hashedPassword, role: 'client', availableHours: [] },
    })
    const expert = await prisma.user.create({
      data: { name: 'Assigned Expert', email: generateUniqueEmail('expert'), password: hashedPassword, role: 'expert', availableHours: ['09:00'] },
    })
    const otherExpert = await prisma.user.create({
      data: { name: 'Other Expert', email: generateUniqueEmail('other-expert'), password: hashedPassword, role: 'expert', availableHours: ['09:00'] },
    })
    const admin = await prisma.user.create({
      data: { name: 'Admin', email: generateUniqueEmail('admin'), password: hashedPassword, role: 'admin', availableHours: [] },
    })

    const service = await prisma.service.create({ data: { name: 'IDOR Test Service', price: 100 } })

    const ticket = await prisma.ticket.create({
      data: {
        title: 'IDOR Test Ticket',
        description: 'Test description',
        clientId: client.id,
        expertId: expert.id,
        services: { connect: [{ id: service.id }] },
      },
    })
    ticketId = ticket.id

    clientToken = jwt.sign({ role: 'client' }, secret, { subject: client.id })
    otherClientToken = jwt.sign({ role: 'client' }, secret, { subject: otherClient.id })
    expertToken = jwt.sign({ role: 'expert' }, secret, { subject: expert.id })
    otherExpertToken = jwt.sign({ role: 'expert' }, secret, { subject: otherExpert.id })
    adminToken = jwt.sign({ role: 'admin' }, secret, { subject: admin.id })
  })

  it('deve permitir que o cliente dono veja o chamado', async () => {
    const res = await request(app)
      .get(`/tickets/${ticketId}/show-detail`)
      .set('Authorization', `Bearer ${clientToken}`)
    expect(res.status).toBe(200)
  })

  it('deve bloquear cliente que não é dono do chamado (IDOR)', async () => {
    const res = await request(app)
      .get(`/tickets/${ticketId}/show-detail`)
      .set('Authorization', `Bearer ${otherClientToken}`)
    expect(res.status).toBe(403)
  })

  it('deve permitir que o expert atribuído veja o chamado', async () => {
    const res = await request(app)
      .get(`/tickets/${ticketId}/show-detail`)
      .set('Authorization', `Bearer ${expertToken}`)
    expect(res.status).toBe(200)
  })

  it('deve bloquear expert não atribuído ao chamado (IDOR)', async () => {
    const res = await request(app)
      .get(`/tickets/${ticketId}/show-detail`)
      .set('Authorization', `Bearer ${otherExpertToken}`)
    expect(res.status).toBe(403)
  })

  it('deve permitir que admin veja qualquer chamado', async () => {
    const res = await request(app)
      .get(`/tickets/${ticketId}/show-detail`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})
