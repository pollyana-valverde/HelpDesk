import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import { authenticateUser, generateUniqueEmail } from './helpers'

describe('Users', () => {
  let adminToken: string

  beforeEach(async () => {
    const hashedPassword = await hash('password123', 8)
    const adminEmail = generateUniqueEmail('admin')
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        availableHours: [],
      },
    })

    adminToken = await authenticateUser(adminEmail, 'password123')
  })

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        name: 'New Client',
        email: generateUniqueEmail('newclient'),
        password: 'password123',
      })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Usuário criado com sucesso')
  })

  it('should create an expert', async () => {
    const response = await request(app)
      .post('/experts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Expert',
        email: generateUniqueEmail('newexpert'),
        password: 'password123',
        availableHours: ['09:00-17:00'],
      })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Técnico criado com sucesso')
  })

  it('should list clients', async () => {
    const response = await request(app)
      .get('/clients')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should list experts', async () => {
    const response = await request(app)
      .get('/experts')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should update a client', async () => {
    const client = await prisma.user.create({
      data: {
        name: 'Update Client',
        email: generateUniqueEmail('updateclient'),
        password: await hash('password123', 8),
        role: 'client',
        availableHours: [],
      },
    })

    const response = await request(app)
      .put(`/clients/${client.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Client',
      })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário atualizado com sucesso')
  })

  it('should update an expert', async () => {
    const expert = await prisma.user.create({
      data: {
        name: 'Update Expert',
        email: generateUniqueEmail('updateexpert'),
        password: await hash('password123', 8),
        role: 'expert',
        availableHours: ['09:00-17:00'],
      },
    })

    const response = await request(app)
      .put(`/experts/${expert.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Expert',
      })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Técnico atualizado com sucesso')
  })

  it('should delete a client', async () => {
    const client = await prisma.user.create({
      data: {
        name: 'Delete Client',
        email: generateUniqueEmail('deleteclient'),
        password: await hash('password123', 8),
        role: 'client',
        availableHours: [],
      },
    })

    const response = await request(app)
      .delete(`/clients/${client.id}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário deletado com sucesso')
  })
})