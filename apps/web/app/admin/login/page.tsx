import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div className="absolute left-1/3 top-1/4 -z-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <LoginForm />
    </main>
  );
}
