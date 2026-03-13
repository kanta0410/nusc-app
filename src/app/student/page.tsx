import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function StudentPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "student") redirect("/admin");

  const activities = await db.getActivities();
  const allAbsences = await db.getAbsences();
  const myAbsences = allAbsences.filter((a) => a.student_id === session.id);

  return (
    <StudentDashboardClient
      studentId={session.id}
      studentName={session.name}
      initialActivities={activities}
      initialAbsences={myAbsences}
    />
  );
}
