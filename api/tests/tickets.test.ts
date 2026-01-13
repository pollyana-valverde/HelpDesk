import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { authConfig } from '../src/configs/auth'
import { generateUniqueEmail } from './helpers'

describe('Tickets', () => {
  let clientToken: string
  let expertToken: string
  let adminToken: string
  let client: any
  let expert: any
  let service1: any
  let service2: any

  beforeEach(async () => {
    // Criar usuários
    const hashedPassword = await hash('password123', 8)
    const clientEmail = generateUniqueEmail('client')
    const expertEmail = generateUniqueEmail('expert')
    const adminEmail = generateUniqueEmail('admin')
    
    client = await prisma.user.create({
      data: {
        name: 'Client User',
        email: clientEmail,
        password: hashedPassword,
        role: 'client',
        availableHours: [],
      },
    })
    expert = await prisma.user.create({
      data: {
        name: 'Expert User',
        email: expertEmail,
        password: hashedPassword,
        role: 'expert',
        availableHours: ['09:00-17:00'],
      },
    })
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        availableHours: [],
      },
    })

    // Criar serviços
    service1 = await prisma.service.create({
      data: {
        name: 'Service 1',
        price: 100,
      },
    })
    service2 = await prisma.service.create({
      data: {
        name: 'Service 2',
        price: 200,
      },
    })

    // Gerar tokens diretamente para evitar inconsistências
    const secret = String(authConfig.jwt.secret)
    clientToken = jwt.sign({ role: 'client' }, secret, { subject: client.id })
    expertToken = jwt.sign({ role: 'expert' }, secret, { subject: expert.id })
    adminToken = jwt.sign({ role: 'admin' }, secret, { subject: admin.id })
  })

  it('should create a ticket', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        expertId: expert.id,
        serviceIds: [service1.id],
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe('Test Ticket')
    expect(response.body.services).toHaveLength(1)
  })

  it('should list tickets', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('tickets')
    expect(Array.isArray(response.body.tickets)).toBe(true)
  })

  it('should show a ticket', async () => {
    const createResponse = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Show Ticket',
        description: 'Description',
        expertId: expert.id,
        serviceIds: [service1.id],
      })

    expect(createResponse.status).toBe(201)

    const ticketId = createResponse.body.id

    const response = await request(app)
      .get(`/tickets/${ticketId}/show`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(ticketId)
    expect(response.body).toHaveProperty('totalPrice')
  })

  it('should show client tickets', async () => {
    const response = await request(app)
      .get('/tickets/client')
      .set('Authorization', `Bearer ${clientToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should show expert tickets', async () => {
    const response = await request(app)
      .get('/tickets/expert')
      .set('Authorization', `Bearer ${expertToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should update ticket status', async () => {
    const createResponse = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Update Status',
        description: 'Description',
        expertId: expert.id,
        serviceIds: [service1.id],
      })

    expect(createResponse.status).toBe(201)

    const ticketId = createResponse.body.id

    const response = await request(app)
      .patch(`/tickets/${ticketId}/status`)
      .set('Authorization', `Bearer ${expertToken}`)
      .send({
        status: 'in_progress',
      })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('in_progress')
  })

  it('should add additional services', async () => {
    const createResponse = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Add Services',
        description: 'Description',
        expertId: expert.id,
        serviceIds: [service1.id],
      })
    expect(createResponse.status).toBe(201)
    const ticketId = createResponse.body.id

    const response = await request(app)
      .patch(`/tickets/${ticketId}/services`)
      .set('Authorization', `Bearer ${expertToken}`)
      .send({
        serviceIds: [service2.id],
      })

    expect(response.status).toBe(200)
    expect(response.body.services).toHaveLength(2)
  })

  it('should delete additional services', async () => {
    const createResponse = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Delete Services',
        description: 'Description',
        expertId: expert.id,
        serviceIds: [service1.id, service2.id],
      })
    expect(createResponse.status).toBe(201)
    const ticketId = createResponse.body.id

    const response = await request(app)
      .delete(`/tickets/${ticketId}/services`)
      .set('Authorization', `Bearer ${expertToken}`)
      .send({
        serviceIds: [service2.id],
      })

    expect(response.status).toBe(200)
    expect(response.body.services).toHaveLength(1)
  })
})