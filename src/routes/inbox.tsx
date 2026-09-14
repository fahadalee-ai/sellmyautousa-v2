import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  ),
});
