// Rasm yuklanmaganda ko'rsatiladigan zaxira (fallback) tasvir.
// Tashqi havola buzilgan yoki o'chirilgan bo'lsa ham hech qachon "buzilgan rasm" belgisi chiqmaydi.
export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f1f5f9"/>
  <g fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M170 70 h60 v30 h-60 z" fill="#cbd5e1" stroke="#94a3b8"/>
    <path d="M150 100 h100 a30 30 0 0 1 30 30 v160 a40 40 0 0 1 -40 40 h-80 a40 40 0 0 1 -40 -40 v-160 a30 30 0 0 1 30 -30 z" fill="#e2e8f0"/>
    <rect x="140" y="170" width="120" height="70" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  </g>
  <text x="200" y="215" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#2563eb" text-anchor="middle">FORTEX</text>
  <text x="200" y="345" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Rasm mavjud emas</text>
</svg>`);

// <img onError={...}> uchun ishlatiladi. Cheksiz sikldan saqlanish uchun bayroq qo'yiladi.
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_IMAGE) {
    img.src = FALLBACK_IMAGE;
    img.onerror = null;
  }
};
