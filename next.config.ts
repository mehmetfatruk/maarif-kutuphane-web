import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Yönetim panelinden PDF ve görsel yüklemeleri için.
    serverActions: { bodySizeLimit: "60mb" },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  async redirects() {
    // Eski sitedeki .php adresleri yeni sayfalara yönlenir.
    return [
      ...[
        "acik-erisim", "dunyada-maarif", "haberler-duyurular", "hakkimizda", "hizmetlerimiz",
        "iletisim", "kutuphane-katalogu", "kutuphane-kurallari", "satin-alma-onerisi",
      ].map((p) => ({ source: `/${p}.php`, destination: `/${p}`, permanent: true })),
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/yayinlarimiz.php", destination: "/maarif-yayinlari", permanent: true },
      { source: "/uyelik-formu", destination: "/", permanent: true },
      { source: "/admin/login", destination: "/admin/giris", permanent: true },
    ];
  },
};

export default nextConfig;
