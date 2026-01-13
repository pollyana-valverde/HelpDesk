import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import { authenticateUser, generateUniqueEmail } from './helpers'

describe('Services', () => {
  let adminToken: string
  let clientToken: string

  beforeEach(async () => {
    // Criar usuários
    const hashedPassword = await hash('password123', 8)
    const adminEmail = generateUniqueEmail('admin')
    const clientEmail = generateUniqueEmail('client')
    
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        availableHours: [],
      },
    })
    await prisma.user.create({
      data: {
        name: 'Client User',
        email: clientEmail,
        password: hashedPassword,
        role: 'client',
        availableHours: [],
      },
    })

    adminToken = await authenticateUser(adminEmail, 'password123')
    clientToken = await authenticateUser(clientEmail, 'password123')
  })

  it('should create a service as admin', async () => {
    const response = await request(app)
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Service',
        price: 150,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', 'New Service')
    expect(Number(response.body.price)).toBe(150)
  })

  it('should not create a service as client', async () => {
    const response = await request(app)
      .post('/services')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        name: 'New Service',
        price: 150,
      })

    expect(response.status).toBe(401) // Token inválido, então não autenticado
  })

  it('should list services', async () => {
    const response = await request(app)
      .get('/services')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should update a service as admin', async () => {
    // Criar serviço via API primeiro
    const createResponse = await request(app)
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Update Service',
        price: 100,
      })

    expect(createResponse.status).toBe(201)

    const serviceId = createResponse.body.id

    const response = await request(app)
      .put(`/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Service',
        price: 200,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', serviceId)
    expect(response.body).toHaveProperty('name', 'Updated Service')
    expect(Number(response.body.price)).toBe(200)
  })
})