import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession, clearSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { action, name, password } = await req.json();

  if (action === "logout") {
    clearSession();
    return NextResponse.json({ ok: true });
  }

  // Login
  const student = await db.getStudentByName(name);
  console.log(`Login attempt for: ${name}, Result: ${student ? "Found" : "Not Found"}`);
  
  if (!student || student.password !== password) {
    return NextResponse.json(
      { error: "名前またはパスワードが間違っています" },
      { status: 401 }
    );
  }

  setSession(student);
  console.log(`Login successful for: ${name}`);
  return NextResponse.json({ ok: true, role: student.role, name: student.name });
}
