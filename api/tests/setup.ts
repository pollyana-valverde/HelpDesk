import { prisma } from '../src/database/prisma'
import { afterAll, beforeEach } from 'vitest'

beforeEach(async () => {
  // Limpar o banco de dados antes de cada teste
  await prisma.ticket.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})