import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma } from '../src/database/prisma'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authConfig } from '../src/configs/auth'
import { generateUniqueEmail } from './helpers'

describe('Client - PATCH /clients/update-password', () => {
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

  it('deve rejeitar a troca quando a senha atual está errada', async () => {
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
