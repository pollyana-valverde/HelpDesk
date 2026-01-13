import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import { generateUniqueEmail } from './helpers'

describe('Sessions', () => {
  let user: any

  beforeEach(async () => {
    // Criar um usuário de teste
    const hashedPassword = await hash('password123', 8)
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: generateUniqueEmail('test'),
        password: hashedPassword,
        role: 'client',
        availableHours: [],
      },
    })
  })

  it('should create a session with valid credentials', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'password123',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).not.toHaveProperty('password')
  })

  it('should not create a session with invalid email', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'invalid@example.com',
        password: 'password123',
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Email ou senha inválidos')
  })

  it('should not create a session with invalid password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Email ou senha inválidos')
  })
})