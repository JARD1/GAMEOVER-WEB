"use client";

export default function AdminLogin({ onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }

  return (
    <div className="panel mx-auto max-w-md p-8">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-neonSoft">Acceso interno</p>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.18em]">Panel Administrativo</h1>
      <p className="mt-3 text-base text-muted">
        Login simulado para administrar el catalogo y mantener el inventario publicado.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Usuario
          </span>
          <input
            type="text"
            defaultValue="admin@gameovercontinue.com"
            className="w-full border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-neon"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Password
          </span>
          <input
            type="password"
            defaultValue="••••••••"
            className="w-full border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-neon"
          />
        </label>

        <button
          type="submit"
          className="w-full border border-neon bg-neon px-4 py-3 font-bold uppercase tracking-[0.2em] text-background transition hover:bg-background hover:text-neon"
        >
          Entrar al dashboard
        </button>
      </form>
    </div>
  );
}
