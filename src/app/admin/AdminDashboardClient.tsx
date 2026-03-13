"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Calendar from "@/components/ui/Calendar";
import StudentList from "@/components/admin/StudentList";
import ActivityModal from "@/components/admin/ActivityModal";
import AbsenceListModal from "@/components/admin/AbsenceListModal";
import { Student, Activity } from "@/types";
import { Users, CalendarDays } from "lucide-react";

interface Props {
  adminName: string;
  initialStudents: Student[];
  initialActivities: Activity[];
  initialAbsenceCounts: Record<string, number>;
}

export default function AdminDashboardClient({
  adminName,
  initialStudents,
  initialActivities,
  initialAbsenceCounts,
}: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [absenceCounts, setAbsenceCounts] = useState<Record<string, number>>(initialAbsenceCounts);

  const [activityModalDate, setActivityModalDate] = useState<string | null>(null);
  const [activityModalActivity, setActivityModalActivity] = useState<Activity | null>(null);
  const [absenceModalActivity, setAbsenceModalActivity] = useState<Activity | null>(null);

  const handleDayClick = (date: string, activity: Activity | null) => {
    setActivityModalDate(date);
    setActivityModalActivity(activity);
  };

  const handleAbsenceClick = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation();
    setAbsenceModalActivity(activity);
  };

  const handleActivitySaved = (activity: Activity) => {
    setActivities((prev) => {
      const exists = prev.find((a) => a.id === activity.id);
      if (exists) return prev.map((a) => (a.id === activity.id ? activity : a));
      return [...prev, activity];
    });
  };

  const handleActivityDeleted = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setAbsenceCounts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const renderCell = (date: string, activity: Activity | null) => {
    if (!activity) return null;
    const count = absenceCounts[activity.id] ?? 0;
    return (
      <div className="text-xs leading-tight space-y-0.5">
        <div className="font-medium truncate text-blue-800">{activity.location}</div>
        <div className="text-blue-500 truncate hidden sm:block">{activity.time_slot}</div>
        {count > 0 && (
          <button
            onClick={(e) => handleAbsenceClick(e, activity)}
            className="mt-0.5 inline-flex items-center gap-0.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-1.5 py-0.5 rounded-full font-medium transition-colors"
          >
            欠席:{count}名
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar name={adminName} role="admin" />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <CalendarDays size={15} />管理ダッシュボード
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">生徒管理</h2>
          </div>
          <StudentList
            students={students}
            onAdded={(s) => setStudents((prev) => [...prev, s])}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">活動カレンダー</h2>
            <span className="text-xs text-gray-400">（日付をクリックして活動を登録）</span>
          </div>
          <Calendar
            activities={activities}
            onDayClick={handleDayClick}
            renderCell={renderCell}
            theme="admin"
          />
        </div>
      </div>

      <ActivityModal
        date={activityModalDate}
        activity={activityModalActivity}
        onClose={() => { setActivityModalDate(null); setActivityModalActivity(null); }}
        onSaved={handleActivitySaved}
        onDeleted={handleActivityDeleted}
      />
      <AbsenceListModal
        activity={absenceModalActivity}
        onClose={() => setAbsenceModalActivity(null)}
      />
    </div>
  );
}
