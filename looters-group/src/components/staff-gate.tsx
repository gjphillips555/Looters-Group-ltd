import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStaff } from "@/lib/staff";
import { getStaffStatus } from "@/lib/staff-access";

export function useStaffAccess() {
  const staff = useStaff();
  const [oauth, setOauth] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    staff.hydrate();
  }, [staff.hydrate]);

  useEffect(() => {
    let alive = true;
    void getStaffStatus()
      .then((s) => {
        if (alive) setOauth(s.staff);
      })
      .catch(() => {
        if (alive) setOauth(false);
      })
      .finally(() => {
        if (alive) setChecked(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  return {
    ready: staff.ready && checked,
    allowed: staff.signedIn || oauth,
    isOwner: staff.isOwner,
    pin: staff.pin,
    logout: staff.logout,
  };
}

export function StaffGate({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const { ready, allowed } = useStaffAccess();

  useEffect(() => {
    if (ready && !allowed) nav({ to: "/staff/login" });
  }, [ready, allowed, nav]);

  if (!ready || !allowed) return <div className="min-h-dvh bg-ink" />;
  return <>{children}</>;
}
