import { prisma } from '../src/database/prisma'
import { afterAll, beforeAll } from 'vitest'

beforeAll(async () => {
  // Limpar o banco de dados antes de cada teste
  await prisma.ticket.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})