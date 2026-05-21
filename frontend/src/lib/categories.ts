import type { ProductCategory } from "@/lib/products";

export interface CategoryMeta {
  slug: string;
  category: ProductCategory;
  label: string;
  tagline: string;
  description: string;
  bannerImg: string;
  gradient: string; // tailwind gradient classes
  emoji: string; // used as inline svg or as separate visual
  badge: string;
}

export const CATEGORIES_META: CategoryMeta[] = [
  {
    slug: "sayuran",
    category: "sayuran",
    label: "Sayuran",
    tagline: "Petik pagi, sampai dapurmu sore",
    description:
      "Aneka sayuran segar dari kebun petani Indonesia. Ditanam dengan metode hidroponik dan tradisional, dipanen pada hari pengiriman untuk menjaga kerenyahan.",
    bannerImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70",
    gradient: "from-green-700 via-harvest-moss to-emerald-900",
    emoji: "🥬",
    badge: "Segar Setiap Hari",
  },
  {
    slug: "buah-buahan",
    category: "buah",
    label: "Buah-buahan",
    tagline: "Manis matang dari pohonnya",
    description:
      "Koleksi buah tropis Indonesia: mangga, alpukat, pisang, salak, pepaya, dan lebih banyak lagi. Dipanen pada tingkat kematangan optimal.",
    bannerImg: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=70",
    gradient: "from-orange-500 via-harvest-ember to-rose-700",
    emoji: "🍎",
    badge: "Manis Alami",
  },
  {
    slug: "beras",
    category: "beras",
    label: "Beras",
    tagline: "Pulen, wangi, dari sawah pilihan",
    description:
      "Beras premium dari sawah Cianjur, Yogyakarta, dan daerah penghasil beras lainnya. Pandan wangi, beras merah organik, ketan hitam — semua tersedia.",
    bannerImg: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=70",
    gradient: "from-amber-700 via-harvest-gold to-yellow-700",
    emoji: "🌾",
    badge: "Premium Quality",
  },
  {
    slug: "rempah",
    category: "rempah",
    label: "Rempah",
    tagline: "Aroma kuat dari kekayaan nusantara",
    description:
      "Cabai, jahe, kunyit, lengkuas, bawang merah — rempah berkualitas ekspor langsung dari petani. Segar, kering, atau bubuk siap olah.",
    bannerImg: "https://images.unsplash.com/photo-1599909533730-3c98c1addb4a?w=1200&q=70",
    gradient: "from-red-700 via-harvest-chili to-orange-700",
    emoji: "🌶️",
    badge: "Aroma Nusantara",
  },
  {
    slug: "bibit-tanaman",
    category: "bibit",
    label: "Bibit Tanaman",
    tagline: "Tanam sendiri, panen sendiri",
    description:
      "Bibit unggul dengan daya tumbuh tinggi. Sayur, cabai, tomat, kangkung — pilihan terbaik untuk pemula maupun petani berpengalaman.",
    bannerImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=70",
    gradient: "from-lime-600 via-harvest-leaf to-green-700",
    emoji: "🌱",
    badge: "Daya Tumbuh 95%",
  },
  {
    slug: "pupuk",
    category: "pupuk",
    label: "Pupuk",
    tagline: "Subur tanahnya, melimpah panennya",
    description:
      "Pupuk organik kompos, cair, NPK, dan berbagai formula untuk kebutuhan agribisnis dan rumahan. Aman, ramah lingkungan.",
    bannerImg: "https://images.unsplash.com/photo-1620231150829-c4c8ad60d3e0?w=1200&q=70",
    gradient: "from-stone-700 via-harvest-soil to-amber-900",
    emoji: "🧪",
    badge: "Tersertifikasi",
  },
  {
    slug: "produk-organik",
    category: "organik",
    label: "Produk Organik",
    tagline: "Sehat untukmu, baik untuk bumi",
    description:
      "Produk organik bersertifikat — tanpa pestisida sintetis, tanpa pupuk kimia. Dipanen dengan tangan oleh petani lokal yang berkomitmen.",
    bannerImg: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1200&q=70",
    gradient: "from-emerald-600 via-harvest-leaf to-teal-700",
    emoji: "🌿",
    badge: "Bersertifikat",
  },
  {
    slug: "umkm-pangan",
    category: "umkm",
    label: "UMKM Pangan",
    tagline: "Cita rasa rumahan, dari tangan lokal",
    description:
      "Produk olahan UMKM Indonesia: madu hutan, kopi Gayo, sambal, keripik, dan lebih banyak lagi. Mendukung ekonomi kreatif keluarga petani.",
    bannerImg: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=70",
    gradient: "from-fuchsia-700 via-rose-700 to-orange-700",
    emoji: "🍯",
    badge: "Produk Lokal",
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES_META.find((c) => c.slug === slug);
}
