export default function Specialties() {
  return (
    <section id="especialidade" className="py-20 bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">
          Minhas <span className="text-[#00FF08]">Especialidades</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          
          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#00FF08]/30 transition">
            <i className="bi bi-code-square text-5xl text-[#00FF08]" />
            <h3 className="text-xl font-semibold mt-4">Websites</h3>
            <p className="mt-2 text-gray-300">
              Aplicações modernas com Next.js, React, APIs e integrações.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#00FF08]/30 transition">
            <i className="bi bi-bar-chart text-5xl text-[#00FF08]" />
            <h3 className="text-xl font-semibold mt-4">Power BI</h3>
            <p className="mt-2 text-gray-300">
              Dashboards completos conectados a fontes de dados reais.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#00FF08]/30 transition">
            <i className="bi bi-brush text-5xl text-[#00FF08]" />
            <h3 className="text-xl font-semibold mt-4">Design</h3>
            <p className="mt-2 text-gray-300">
              Identidade visual, banners, logos e material para redes.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
