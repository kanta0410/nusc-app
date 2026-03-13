import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.student.upsert({
    where: { name: '管理者太郎' },
    update: {},
    create: {
      name: '管理者太郎',
      password: 'nusc',
      role: 'admin',
    },
  })

  console.log({ admin })

  // Add some students
  const students = [
    { name: '山田花子', password: 'nusc', role: 'student' },
    { name: '佐藤次郎', password: 'nusc', role: 'student' },
  ]

  for (const s of students) {
    await prisma.student.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
