import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../../src/configs/auth'
import { authenticateUser, generateUniqueEmail } from '../helpers'

describe('Clients', () => {
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

  it('should list clients', async () => {
    const response = await request(app)
      .get('/clients')
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
      .put(`/clients/${client.id}/update`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Client' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário atualizado com sucesso')
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
      .delete(`/clients/${client.id}/delete`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário deletado com sucesso')
  })

  describe('PATCH /clients/update-password', () => {
    let clientToken: string

    beforeEach(async () => {
      const hashedPassword = await hash('senha123', 8)
      const secret = String(authConfig.jwt.secret)

      const client = await prisma.user.create({
        data: {
          name: 'Test Client',
          email: generateUniqueEmail('client'),
          password: hashedPassword,
          role: 'client',
          availableHours: [],
        },
      })

      clientToken = jwt.sign({ role: 'client' }, secret, { subject: client.id })
    })

    it('deve trocar a senha quando a senha atual está correta', async () => {
      const res = await request(app)
        .patch('/clients/update-password')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ currentPassword: 'senha123', newPassword: 'novaSenha456' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Senha atualizada com sucesso')
    })

    it('deve rejeitar quando a senha atual está errada', async () => {
      const res = await request(app)
        .patch('/clients/update-password')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ currentPassword: 'senhaErrada', newPassword: 'novaSenha456' })

      expect(res.status).toBe(400)
    })

    it('deve rejeitar quando currentPassword está ausente', async () => {
      const res = await request(app)
        .patch('/clients/update-password')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ newPassword: 'novaSenha456' })

      expect(res.status).toBe(400)
    })

    it('deve rejeitar quando newPassword está ausente', async () => {
      const res = await request(app)
        .patch('/clients/update-password')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ currentPassword: 'senha123' })

      expect(res.status).toBe(400)
    })
  })
})
