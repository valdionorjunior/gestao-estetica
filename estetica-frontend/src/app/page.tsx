import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1A1A1A] mb-6">
          <span className="font-serif text-2xl font-bold text-[#D4AF37]">NS</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#1A1A1A] mb-2">
          Estética Natalia Salvador
        </h1>
        <p className="text-[#6B6560] mb-8">Sistema de gestão integrado</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1A1A1A] font-semibold px-6 py-3 rounded-xl hover:bg-[#B8962E] transition-colors"
        >
          Acessar Sistema →
        </Link>
      </div>
    </div>
  );
}
