import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../src/configs/auth'
import { generateUniqueEmail } from './helpers'

describe('Tickets - impede remover último serviço', () => {
  let expertToken: string
  let ticketId: string
  let serviceId: string

  beforeEach(async () => {
    const hashedPassword = await hash('password123', 8)
    const secret = String(authConfig.jwt.secret)

    const client = await prisma.user.create({
      data: { name: 'Client', email: generateUniqueEmail('client'), password: hashedPassword, role: 'client', availableHours: [] },
    })
    const expert = await prisma.user.create({
      data: { name: 'Expert', email: generateUniqueEmail('expert'), password: hashedPassword, role: 'expert', availableHours: ['09:00'] },
    })

    const service = await prisma.service.create({ data: { name: 'Único Serviço', price: 100 } })
    serviceId = service.id

    const ticket = await prisma.ticket.create({
      data: {
        title: 'Last Service Test',
        description: 'Test description',
        clientId: client.id,
        expertId: expert.id,
        services: { connect: [{ id: service.id }] },
      },
    })
    ticketId = ticket.id

    expertToken = jwt.sign({ role: 'expert' }, secret, { subject: expert.id })
  })

  it('deve bloquear remoção quando restariam zero serviços', async () => {
    const res = await request(app)
      .delete(`/tickets/${ticketId}/delete-services`)
      .set('Authorization', `Bearer ${expertToken}`)
      .send({ serviceIds: [serviceId] })
    expect(res.status).toBe(400)
    expect(res.body.message).toContain('ao menos um serviço')
  })
})
