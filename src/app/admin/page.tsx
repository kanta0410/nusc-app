import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/student");

  const allStudents = await db.getStudents();
  const students = allStudents.filter((s) => s.role === "student");
  const activities = await db.getActivities();
  const absences = await db.getAbsences();

  const absenceCounts: Record<string, number> = {};
  absences.forEach((ab) => {
    absenceCounts[ab.activity_id] = (absenceCounts[ab.activity_id] ?? 0) + 1;
  });

  return (
    <AdminDashboardClient
      adminName={session.name}
      initialStudents={students}
      initialActivities={activities}
      initialAbsenceCounts={absenceCounts}
    />
  );
}
