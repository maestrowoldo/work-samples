// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-zinc-500 md:flex-row lg:px-6">
        <p>&copy; {new Date().getFullYear()} Woldo Pro · Wolkendo Arias.</p>
        <p>Desenvolvimento Web · Power BI · Power Platform</p>
      </div>
    </footer>
  );
}
