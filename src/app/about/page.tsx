'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import LandingFooter from '@/app/public-landing-page/components/LandingFooter';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowRight,
  BookOpen,
  Eye,
  Flag,
  HelpCircle,
  Layers,
  Map,
  Shield,
  Users,
} from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const isId = language === 'id';

  const missionCards = [
    {
      title: isId ? 'Komunitas pesisir' : 'Coastal communities',
      body: isId
        ? 'Mencatat pengamatan di pantai, muara, dan perairan sekitar dengan konteks lapangan yang jelas.'
        : 'Document observations along coasts, river mouths, and nearby waters with clear field context.',
    },
    {
      title: isId ? 'Kontributor' : 'Contributors',
      body: isId
        ? 'Mengirim bukti terstruktur—kategori, perkiraan jumlah, waktu, dan konteks lokasi—bukan klaim longgar.'
        : 'Submit structured evidence: category, estimated quantity, date, and location context—not loose claims.',
    },
    {
      title: isId ? 'Analis' : 'Analysts',
      body: isId
        ? 'Menjelajahi pola spasial dan temporal pada observasi yang telah ditinjau serta estimasi yang diberi label jelas.'
        : 'Explore spatial and temporal patterns in reviewed observations and clearly labeled estimates.',
    },
    {
      title: isId ? 'Pemimpin proyek' : 'Project leads',
      body: isId
        ? 'Melihat kesenjangan cakupan dan memprioritaskan pemantauan di tempat bukti masih tipis.'
        : 'Spot coverage gaps and prioritize monitoring where evidence is still thin.',
    },
  ];

  const steps = [
    {
      n: '1',
      title: isId ? 'Amati' : 'Observe',
      body: isId
        ? 'Kontributor mencatat temuan sampah laut beserta detail lapangan yang relevan.'
        : 'Contributors record a marine-waste observation with relevant field details.',
    },
    {
      n: '2',
      title: isId ? 'Kirim' : 'Submit',
      body: isId
        ? 'Laporan dapat mencakup kategori, perkiraan jumlah, tanggal, konteks lokasi, dan bukti opsional.'
        : 'Reports can include category, quantity, date, location context, and optional evidence.',
    },
    {
      n: '3',
      title: isId ? 'Tinjau' : 'Review',
      body: isId
        ? 'Laporan masuk alur platform dan dapat ditinjau atau divalidasi sesuai alur kerja yang tersedia.'
        : 'Reports enter the platform workflow and may be reviewed or validated according to platform workflow.',
    },
    {
      n: '4',
      title: isId ? 'Jelajahi' : 'Explore',
      body: isId
        ? 'Observasi yang telah ditinjau dan estimasi yang diberi label dapat dijelajahi lewat peta dan analitik.'
        : 'Reviewed observations and clearly labeled estimates can be explored through maps and analytics.',
    },
  ];

  return (
    <AppLayout currentPath="/about">
      <div className="wave-bg min-h-screen">
        <div className="max-w-screen-lg mx-auto px-4 lg:px-8 py-10 md:py-14 space-y-16">
          <header className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{isId ? 'Tentang Oceaniq' : 'About Oceaniq'}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isId ? 'Bukti yang lebih baik untuk perairan Indonesia yang lebih bersih.' : 'Data-Driven Marine Conservation for Cleaner Indonesian Waters.'}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
              {isId
                ? 'Oceaniq adalah platform pemantauan sampah laut dan sains warga yang menggabungkan prediksi machine learning, observasi lapangan, laporan komunitas, pemetaan geospasial, dan analisis berbasis data agar orang dapat memahami di mana sampah laut muncul, bagaimana kondisinya berubah, dan di mana tindakan mungkin diperlukan.'
                : 'Oceaniq is a marine-waste monitoring and citizen-science platform that brings together machine learning forecast, field observations, community reports, geospatial mapping, and data-driven analysis to help people understand where marine debris appears, how it changes, and where action may be needed.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/interactive-map" className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
                <Map size={16} aria-hidden />
                {isId ? 'Jelajahi Peta Pemantauan' : 'Explore the Monitoring Map'}
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors"
              >
                {isId ? 'Menjadi Kontributor' : 'Become a Contributor'}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </header>

          <section className="space-y-3" aria-labelledby="about-challenge">
            <h2 id="about-challenge" className="text-xl font-bold text-foreground">
              {isId ? 'Sampah laut bersifat lokal, dinamis, dan sering kurang teramati.' : 'Marine waste is local, dynamic, and often under-observed.'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isId
                ? 'Sebaran sampah dapat berbeda di pantai, muara sungai, dan perairan terbuka. Kondisi juga berubah karena cuaca, pasang, aktivitas setempat, dan aksi bersih. Tindakan yang berguna membutuhkan observasi yang dapat ditelusuri dan konteks data yang jelas—bukan angka yang terlepas dari tempat dan waktu.'
                : 'Waste distribution can differ across coasts, river mouths, and marine areas. Conditions can change over time due to weather, tides, local activity, and cleanup efforts. Useful action needs traceable observations and clear data context—not figures detached from place and time.'}
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="about-mission">
            <h2 id="about-mission" className="text-xl font-bold text-foreground">
              {isId ? 'Dari laporan terpencar menjadi wawasan lingkungan yang dapat dipakai.' : 'From scattered reports to usable environmental insight.'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {missionCards.map((card) => (
                <article key={card.title} className="glass-card-elevated border border-border/50 rounded-xl p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-5" aria-labelledby="about-how">
            <h2 id="about-how" className="text-xl font-bold text-foreground">
              {isId ? 'Bagaimana laporan menjadi wawasan.' : 'How a report becomes insight.'}
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
              {steps.map((step) => (
                <li key={step.n} className="glass-card border border-border/50 rounded-xl p-5 space-y-2">
                  <p className="text-xs font-mono font-bold text-primary">
                    {step.n}. {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">
              {isId
                ? 'Tidak setiap kiriman otomatis ditampilkan atau disetujui. Moderasi dan validasi mengikuti alur kerja platform yang tersedia.'
                : 'Not every submission is automatically displayed or approved. Moderation and validation follow the platform workflow that is available.'}
            </p>
          </section>

          <section id="data" className="space-y-5 scroll-mt-24" aria-labelledby="about-transparency">
            <h2 id="about-transparency" className="text-xl font-bold text-foreground">
              {isId ? 'Label yang jelas, penafsiran yang bertanggung jawab.' : 'Clear labels, responsible interpretation.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-xl border border-border/50 p-5 space-y-2 bg-card/40">
                <div className="flex items-center gap-2 text-positive">
                  <Shield size={16} aria-hidden />
                  <h3 className="text-sm font-semibold text-foreground">{isId ? 'Observasi terverifikasi' : 'Verified observations'}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? 'Catatan lapangan yang dikumpulkan melalui pemantauan terstruktur.'
                    : 'Field records collected through structured monitoring.'}
                </p>
              </article>
              <article className="rounded-xl border border-border/50 p-5 space-y-2 bg-card/40">
                <div className="flex items-center gap-2 text-accent">
                  <Users size={16} aria-hidden />
                  <h3 className="text-sm font-semibold text-foreground">{isId ? 'Laporan warga' : 'Citizen reports'}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? 'Kiriman komunitas yang mungkin memerlukan tinjauan atau validasi.'
                    : 'Community submissions that may require review or validation.'}
                </p>
              </article>
              <article id="models" className="rounded-xl border border-border/50 p-5 space-y-2 bg-card/40 scroll-mt-24">
                <div className="flex items-center gap-2 text-primary">
                  <Layers size={16} aria-hidden />
                  <h3 className="text-sm font-semibold text-foreground">{isId ? 'Estimasi model' : 'Model estimates'}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isId
                    ? 'Prediksi turunan data yang harus dilabeli sebagai estimasi, bukan pengukuran langsung.'
                    : 'Data-derived predictions that must be clearly labeled as estimates rather than direct measurements.'}
                </p>
              </article>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed border border-border/50 rounded-xl p-4 bg-muted/20">
              {isId
                ? 'Data Oceaniq dapat tidak lengkap, tertunda, bergantung konteks, atau direvisi. Data ini tidak boleh dipakai sebagai satu-satunya dasar respons darurat, navigasi, penegakan, atau keputusan berisiko tinggi lainnya.'
                : 'Oceaniq data can be incomplete, delayed, context-dependent, or subject to revision. It should not be used as the sole basis for emergency response, navigation, enforcement, or other high-stakes decisions.'}
            </p>
            <p>
              <Link href="/faq" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                {isId ? 'Baca FAQ dan catatan metodologi' : 'Read the FAQ and methodology notes'}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </p>
          </section>

          <section id="methodology" className="space-y-3 scroll-mt-24" aria-labelledby="about-method">
            <h2 id="about-method" className="text-xl font-bold text-foreground">
              {isId ? 'Catatan metodologi' : 'Methodology notes'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isId
                ? 'Oceaniq memisahkan observasi lapangan, laporan komunitas, dan estimasi pembelajaran mesin. Layer peta dan dasbor analitik harus dibaca bersama label sumber datanya. Estimasi model membantu eksplorasi pola; estimasi itu bukan pengganti survei di lapangan.'
                : 'Oceaniq separates field observations, community reports, and machine learning forecasts. Map layers and analytics dashboards should be read together with their source labels. Model estimates help explore patterns; they are not a substitute for field survey.'}
            </p>
          </section>

          <section id="api" className="space-y-3 scroll-mt-24" aria-labelledby="about-api">
            <h2 id="about-api" className="text-xl font-bold text-foreground">
              {isId ? 'Akses data dan API' : 'Data and API access'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isId
                ? 'Dataset yang dipublikasikan Oceaniq mengikuti lisensi data terbuka, kecuali suatu dataset menyatakan sebaliknya. Akses API publik yang luas belum menjadi jaminan produk; gunakan data yang diterbitkan dan dokumentasi lisensi sebagai acuan penggunaan kembali.'
                : 'Oceaniq-published datasets follow the open-data license unless a dataset says otherwise. Broad public API access is not a product guarantee; use published data and the license documentation as the reuse reference.'}
            </p>
          </section>

          <section className="space-y-4" aria-labelledby="about-community">
            <h2 id="about-community" className="text-xl font-bold text-foreground">
              {isId ? 'Setiap observasi yang cermat dapat membantu.' : 'Every careful observation can help.'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isId
                ? 'Kontributor publik dapat mengirim laporan terstruktur. Utamakan akurasi, konteks, dan berbagi yang bertanggung jawab. Jangan unggah data pribadi yang tidak perlu, kata sandi, token akses, atau lokasi sensitif. Data yang disetujui atau dipublikasikan dapat membantu pemahaman publik tentang sampah laut.'
                : 'Public contributors can submit structured reports. Contributions should prioritize accuracy, context, and responsible sharing. Do not upload unnecessary personal information, passwords, access tokens, or sensitive location data. Approved or published data may contribute to public understanding of marine debris.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contribute" className="btn-primary inline-flex items-center gap-2 text-sm">
                {isId ? 'Kirim Observasi' : 'Submit an Observation'}
              </Link>
              <Link href="/faq" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-primary/40 transition-colors">
                <HelpCircle size={16} aria-hidden />
                {isId ? 'Baca FAQ' : 'Read the FAQ'}
              </Link>
              <Link href="/report-a-problem" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-primary/40 transition-colors">
                <Flag size={16} aria-hidden />
                {isId ? 'Laporkan Masalah' : 'Report a Problem'}
              </Link>
            </div>
          </section>

          <section className="space-y-3" aria-labelledby="about-opendata">
            <h2 id="about-opendata" className="text-xl font-bold text-foreground">
              {isId ? 'Data terbuka, dengan atribusi dan konteks.' : 'Open data, with attribution and context.'}
            </h2>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
              <li>
                {isId
                  ? 'Dataset yang dipublikasikan Oceaniq tersedia di bawah CC BY 4.0 kecuali suatu dataset menyatakan sebaliknya.'
                  : 'Oceaniq-published datasets are available under CC BY 4.0 unless a dataset explicitly says otherwise.'}
              </li>
              <li>
                {isId
                  ? 'Pengguna ulang boleh membagikan dan mengadaptasi data yang dipublikasikan dengan atribusi yang sesuai.'
                  : 'Reusers may share and adapt the published data with appropriate attribution.'}
              </li>
              <li>
                {isId
                  ? 'Data pribadi, informasi akun privat, kiriman yang belum dipublikasikan, materi pihak ketiga, dan konten terbatas tidak otomatis termasuk dalam lisensi data terbuka.'
                  : 'Personal data, private account information, unpublished submissions, third-party material, and restricted content are not automatically included in the open-data license.'}
              </li>
            </ul>
            <Link href="/open-data-license" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
              {isId ? 'Baca Lisensi Data Terbuka' : 'Read the Open Data License'}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </section>

          <section className="space-y-3" aria-labelledby="about-context">
            <h2 id="about-context" className="text-xl font-bold text-foreground">
              {isId ? 'Dibangun sebagai capstone informatika lingkungan.' : 'Built as an environmental-informatics capstone.'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isId
                ? 'Oceaniq dikembangkan sebagai proyek capstone Informatika yang menelusuri analisis data lingkungan, pemetaan berbasis web, dasbor interaktif, dan alur sains warga untuk pemantauan sampah laut. Halaman ini tidak menyatakan dukungan pemerintah, kemitraan institusi resmi, wewenang operasional, atau sertifikasi ilmiah.'
                : 'Oceaniq is developed as an Informatics capstone project exploring environmental data analysis, web-based mapping, interactive dashboards, and citizen-science workflows for marine-waste monitoring. This page does not claim government endorsement, institutional partnership, official operational authority, or scientific certification.'}
            </p>
          </section>

          <section className="glass-card-elevated border border-border rounded-2xl p-8 text-center space-y-4" aria-labelledby="about-close">
            <BookOpen className="mx-auto text-primary" size={28} aria-hidden />
            <h2 id="about-close" className="text-xl font-bold text-foreground">
              {isId ? 'Bantu membangun gambaran yang lebih jelas tentang sampah laut.' : 'Help build a clearer picture of marine waste.'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/interactive-map" className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
                <Eye size={16} aria-hidden />
                {isId ? 'Jelajahi Peta' : 'Explore the Map'}
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-primary/40 transition-colors"
              >
                {isId ? 'Kirim Observasi' : 'Contribute an Observation'}
              </Link>
            </div>
          </section>
        </div>
        <LandingFooter />
      </div>
    </AppLayout>
  );
}
