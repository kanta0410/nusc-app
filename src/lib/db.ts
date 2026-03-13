import { PrismaClient } from '@prisma/client'
import { Student, Activity, Absence } from "@/types";

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export const db = {
  // Students
  getStudents: async () => {
    return await prisma.student.findMany();
  },
  getStudentByName: async (name: string) => {
    return await prisma.student.findUnique({ where: { name } });
  },
  getStudentById: async (id: string) => {
    return await prisma.student.findUnique({ where: { id } });
  },
  addStudent: async (name: string) => {
    return await prisma.student.create({
      data: {
        name,
        password: "nusc",
        role: "student",
      },
    });
  },

  // Activities
  getActivities: async () => {
    return await prisma.activity.findMany({
      orderBy: { date: 'asc' }
    });
  },
  getActivityById: async (id: string) => {
    return await prisma.activity.findUnique({ where: { id } });
  },
  getActivityByDate: async (date: string) => {
    return await prisma.activity.findFirst({ where: { date } });
  },
  addActivity: async (
    date: string,
    time_slot: string,
    location: string
  ) => {
    return await prisma.activity.create({
      data: {
        date,
        time_slot,
        location,
      },
    });
  },
  updateActivity: async (
    id: string,
    data: { date?: string; time_slot?: string; location?: string }
  ) => {
    return await prisma.activity.update({
      where: { id },
      data,
    });
  },
  deleteActivity: async (id: string) => {
    // Delete related absences first
    await prisma.absence.deleteMany({ where: { activity_id: id } });
    return await prisma.activity.delete({ where: { id } });
  },

  // Absences
  getAbsences: async () => {
    return await prisma.absence.findMany();
  },
  getAbsencesByActivity: async (activity_id: string) => {
    return await prisma.absence.findMany({
      where: { activity_id },
      include: { student: true }
    });
  },
  getAbsenceByStudentAndActivity: async (
    student_id: string,
    activity_id: string
  ) => {
    return await prisma.absence.findUnique({
      where: {
        student_id_activity_id: {
          student_id,
          activity_id,
        },
      },
    });
  },
  addAbsence: async (
    student_id: string,
    activity_id: string,
    reason: string,
    reason_detail: string
  ) => {
    return await prisma.absence.create({
      data: {
        student_id,
        activity_id,
        reason,
        reason_detail,
      },
    });
  },
  deleteAbsence: async (id: string) => {
    return await prisma.absence.delete({ where: { id } });
  },
};

export default prisma;
