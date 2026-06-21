import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AdminLoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-5 dark:bg-slate-950">
      <div className="absolute right-5 top-5"><ThemeToggle /></div>
      <div className="absolute left-1/3 top-1/4 -z-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <LoginForm />
    </main>
  );
}
