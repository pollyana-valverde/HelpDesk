import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../../src/configs/auth'
import { generateUniqueEmail } from '../helpers'

describe('Tickets IDOR - ações de expert em tickets de outros', () => {
  let assignedExpertToken: string
  let otherExpertToken: string
  let service1Id: string
  let service2Id: string
  let ticketId: string

  beforeEach(async () => {
    const hashedPassword = await hash('password123', 8)
    const secret = String(authConfig.jwt.secret)

    const client = await prisma.user.create({
      data: { name: 'Client', email: generateUniqueEmail('client'), password: hashedPassword, role: 'client', availableHours: [] },
    })
    const assignedExpert = await prisma.user.create({
      data: { name: 'Assigned Expert', email: generateUniqueEmail('expert'), password: hashedPassword, role: 'expert', availableHours: ['09:00'] },
    })
    const otherExpert = await prisma.user.create({
      data: { name: 'Other Expert', email: generateUniqueEmail('other-expert'), password: hashedPassword, role: 'expert', availableHours: ['09:00'] },
    })

    const service1 = await prisma.service.create({ data: { name: 'Svc1', price: 100 } })
    const service2 = await prisma.service.create({ data: { name: 'Svc2', price: 200 } })
    service1Id = service1.id
    service2Id = service2.id

    const ticket = await prisma.ticket.create({
      data: {
        title: 'Expert IDOR Test',
        description: 'Test description',
        clientId: client.id,
        expertId: assignedExpert.id,
        services: { connect: [{ id: service1.id }] },
      },
    })
    ticketId = ticket.id

    assignedExpertToken = jwt.sign({ role: 'expert' }, secret, { subject: assignedExpert.id })
    otherExpertToken = jwt.sign({ role: 'expert' }, secret, { subject: otherExpert.id })
  })

  it('expert não atribuído não pode atualizar status', async () => {
    const res = await request(app)
      .patch(`/tickets/${ticketId}/update-status`)
      .set('Authorization', `Bearer ${otherExpertToken}`)
      .send({ status: 'in_progress' })
    expect(res.status).toBe(403)
  })

  it('expert atribuído pode atualizar status', async () => {
    const res = await request(app)
      .patch(`/tickets/${ticketId}/update-status`)
      .set('Authorization', `Bearer ${assignedExpertToken}`)
      .send({ status: 'in_progress' })
    expect(res.status).toBe(200)
  })

  it('expert não atribuído não pode adicionar serviços', async () => {
    const res = await request(app)
      .patch(`/tickets/${ticketId}/add-services`)
      .set('Authorization', `Bearer ${otherExpertToken}`)
      .send({ serviceIds: [service2Id] })
    expect(res.status).toBe(403)
  })

  it('expert atribuído pode adicionar serviços', async () => {
    const res = await request(app)
      .patch(`/tickets/${ticketId}/add-services`)
      .set('Authorization', `Bearer ${assignedExpertToken}`)
      .send({ serviceIds: [service2Id] })
    expect(res.status).toBe(200)
  })

  it('expert não atribuído não pode remover serviços', async () => {
    const res = await request(app)
      .delete(`/tickets/${ticketId}/delete-services`)
      .set('Authorization', `Bearer ${otherExpertToken}`)
      .send({ serviceIds: [service1Id] })
    expect(res.status).toBe(403)
  })

  it('expert atribuído pode remover serviços (quando restam outros)', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/add-services`)
      .set('Authorization', `Bearer ${assignedExpertToken}`)
      .send({ serviceIds: [service2Id] })

    const res = await request(app)
      .delete(`/tickets/${ticketId}/delete-services`)
      .set('Authorization', `Bearer ${assignedExpertToken}`)
      .send({ serviceIds: [service1Id] })
    expect(res.status).toBe(200)
  })
})
