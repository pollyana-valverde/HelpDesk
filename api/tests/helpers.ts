import request from 'supertest'
import { app } from '../src/app'

export async function authenticateUser(email: string, password: string) {
  const response = await request(app)
    .post('/sessions')
    .send({ email, password })

  return response.body.token
}

export function generateUniqueEmail(prefix: string) {
  return `${prefix}${Date.now()}${Math.random().toString(36).substring(2)}@example.com`
}