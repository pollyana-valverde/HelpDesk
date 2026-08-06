import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../../src/configs/auth'
import { authenticateUser, generateUniqueEmail } from '../helpers'

describe('Experts', () => {
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

  it('should list experts', async () => {
    const response = await request(app)
      .get('/experts')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
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
      .put(`/experts/${expert.id}/update`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Expert' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Técnico atualizado com sucesso')
  })

  describe('PATCH /experts/update-password', () => {
    let expertToken: string

    beforeEach(async () => {
      const hashedPassword = await hash('senha123', 8)
      const secret = String(authConfig.jwt.secret)

      const expert = await prisma.user.create({
        data: {
          name: 'Test Expert',
          email: generateUniqueEmail('expert'),
          password: hashedPassword,
          role: 'expert',
          availableHours: ['09:00-17:00'],
        },
      })

      expertToken = jwt.sign({ role: 'expert' }, secret, { subject: expert.id })
    })

    it('deve trocar a senha quando a senha atual está correta', async () => {
      const res = await request(app)
        .patch('/experts/update-password')
        .set('Authorization', `Bearer ${expertToken}`)
        .send({ currentPassword: 'senha123', newPassword: 'novaSenha456' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Senha atualizada com sucesso')
    })

    it('deve rejeitar quando a senha atual está errada', async () => {
      const res = await request(app)
        .patch('/experts/update-password')
        .set('Authorization', `Bearer ${expertToken}`)
        .send({ currentPassword: 'senhaErrada', newPassword: 'novaSenha456' })

      expect(res.status).toBe(400)
    })

    it('deve rejeitar quando currentPassword está ausente', async () => {
      const res = await request(app)
        .patch('/experts/update-password')
        .set('Authorization', `Bearer ${expertToken}`)
        .send({ newPassword: 'novaSenha456' })

      expect(res.status).toBe(400)
    })

    it('deve rejeitar quando newPassword está ausente', async () => {
      const res = await request(app)
        .patch('/experts/update-password')
        .set('Authorization', `Bearer ${expertToken}`)
        .send({ currentPassword: 'senha123' })

      expect(res.status).toBe(400)
    })
  })
})
