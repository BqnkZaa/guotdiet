import { prisma } from '@/lib/prisma'
import { AdminDashboard } from './dashboard'

export default async function ManagePage() {
  const foods = await prisma.food.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return <AdminDashboard foods={foods} />
}
