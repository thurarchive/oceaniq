export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Navigation & Common
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      map: 'Peta Interaktif',
      analytics: 'Analisis & Data',
      leaderboard: 'Peringkat',
      dashboard: 'Dasbor Saya',
      admin: 'Panel Admin',
      signIn: 'Masuk',
      signOut: 'Keluar',
      contribute: 'Laporkan Sampah',
      contributeShort: 'Lapor',
      notifications: 'Notifikasi',
      newNotifications: 'baru',
      signedInAs: 'Masuk sebagai',
      searchPlaceholder: 'Cari zona atau lokasi...',
      themeLight: 'Mode Terang',
      themeDark: 'Mode Gelap',
    },
    roles: {
      administrator: 'Administrator',
      analyst: 'Analis Terverifikasi',
      contributor: 'Kontributor Sains Warga',
      user: 'Pengguna',
    },
    common: {
      loading: 'Memuat data...',
      save: 'Simpan',
      cancel: 'Batal',
      submit: 'Kirim',
      close: 'Tutup',
      filter: 'Filter',
      refresh: 'Segarkan',
      export: 'Ekspor',
      all: 'Semua',
      viewAll: 'Lihat Semua',
      details: 'Detail',
      status: 'Status',
      date: 'Tanggal',
      location: 'Lokasi',
      zone: 'Zona',
      category: 'Kategori',
      severity: 'Tingkat Keparahan',
      verified: 'Terverifikasi',
      pending: 'Menunggu Review',
      rejected: 'Ditolak',
      actions: 'Tindakan',
      confidence: 'Tingkat Keyakinan',
      high: 'Tinggi',
      medium: 'Sedang',
      low: 'Rendah',
      kg: 'kg',
      itemsPerM2: 'item/m²',
      gramsPerM2: 'g/m²',
      wib: 'WIB',
    },
    // Landing Page
    landing: {
      badge: 'Platform Pemantauan Sampah Laut Indonesia',
      heroTitlePrefix: 'Melindungi Pesisir Nusantara dengan ',
      heroTitleHighlight: 'Sains Warga & AI',
      heroSubtitle: 'Oceaniq mengintegrasikan observasi lapangan, pelaporan komunitas pesisir, dan pemodelan prediktif berbasis machine learning untuk memantau serta mengurangi sampah laut di seluruh zona pesisir Indonesia.',
      exploreMap: 'Jelajahi Peta Pesisir',
      reportWaste: 'Laporkan Temuan Sampah',
      liveBadge: 'Data Observasi Langsung',

      // Live Stats Bar
      stats: {
        totalWasteLogged: 'Total Sampah Tercatat',
        monitoredZones: 'Zona Pesisir Terpantau',
        citizenReports: 'Laporan Sains Warga',
        mlAccuracy: 'Rata-rata Kesalahan Absolut',
        activeHotspots: 'Titik Rawan Aktif',
      },

      // Feature Highlights
      features: {
        tag: 'Fitur Utama',
        title: 'Teknologi Cerdas untuk Konservasi Lautan',
        subtitle: 'Sistem komprehensif yang menghubungkan masyarakat pesisir, peneliti, dan pengambil kebijakan.',
        f1Title: 'Peta Interaktif Real-Time',
        f1Desc: 'Visualisasi sebaran densitas sampah, titik akumulasi (hotspots), dan stasiun cuaca maritim di pesisir Indonesia.',
        f2Title: 'Prediksi Berbasis AI (XGBoost)',
        f2Desc: 'Estimasi densitas sampah laut berdasarkan data historis, curah hujan, pasang surut, dan arah angin maritim.',
        f3Title: 'Pelaporan Sains Warga',
        f3Desc: 'Mekanisme pelaporan cepat berbasis foto dan GPS untuk masyarakat, nelayan, dan relawan pembersih pantai.',
        f4Title: 'Analisis Komposisi Sampah',
        f4Desc: 'Pelacakan proporsi plastik makro, jaring nelayan, styrofoam, dan limbah organik secara mendalam.',
      },

      // How It Works
      howItWorks: {
        tag: 'Alur Kerja',
        title: 'Bagaimana Oceaniq Bekerja',
        subtitle: 'Dari laporan di bibir pantai hingga keputusan kebijakan berbasis bukti.',
        step1Title: '1. Observasi & Pelaporan',
        step1Desc: 'Warga, relawan, atau peneliti mengambil foto dan menandai koordinat sampah laut saat aksi bersih pantai.',
        step2Title: '2. Verifikasi & Analisis AI',
        step2Desc: 'Data diverifikasi oleh tim ahli dan diselaraskan dengan parameter cuaca maritim oleh model machine learning.',
        step3Title: '3. Pemetaan & Penanganan',
        step3Desc: 'Titik rawan muncul di peta interaktif untuk mengarahkan armada pembersihan dan mendukung kebijakan daerah.',
      },

      // Contributor Benefits & Gamification
      benefits: {
        tag: 'Dampak & Apresiasi',
        title: 'Berkontribusi untuk Laut Indonesia yang Lebih Bersih',
        subtitle: 'Dapatkan lencana kehormatan, poin kontribusi, dan jadilah pahlawan konservasi pesisir Nusantara.',
        b1Title: 'Lencana & Peringkat Komunitas',
        b1Desc: 'Kumpulkan poin kontribusi dari setiap laporan tervalidasi dan raih status Penjaga Pesisir.',
        b2Title: 'Data Terbuka untuk Riset',
        b2Desc: 'Seluruh data dapat diakses oleh akademisi, LSM lingkungan, dan instansi pemerintah.',
        b3Title: 'Aksi Bersih Terarah',
        b3Desc: 'Bantu komunitas lokal memprioritaskan titik pembersihan paling kritis secara efisien.',
      },

      // Leaderboard Preview
      leaderboardPreview: {
        tag: 'Pahlawan Pesisir',
        title: 'Kontributor Teratas Pekan Ini',
        subtitle: 'Apresiasi tertinggi bagi masyarakat yang aktif menjaga kelestarian pantai dan laut kita.',
        viewFull: 'Lihat Klasemen Lengkap',
        points: 'Poin',
        reportsCount: 'Laporan',
      },

      // Hotspot Alert Banner
      hotspotBanner: {
        tag: 'Peringatan Titik Kritis',
        title: 'Akumulasi Sampah Terdeteksi di Teluk Jakarta Utara & Selat Bali',
        desc: 'Model AI memprediksi peningkatan akumulasi sampah plastik hingga 35% akibat curah hujan tinggi dan pola arus pasang.',
        action: 'Lihat di Peta',
      },

      // Methodology Note
      methodology: {
        tag: 'Transparansi & Metodologi',
        title: 'Metodologi Pemantauan Ilmiah',
        desc: 'Pengumpulan data Oceaniq mengadopsi format International Coastal Cleanup (ICC) yang dikembangkan oleh Ocean Conservancy International, dikombinasikan dengan dataset lingkungan OceanKita. Metode Line in Transect (LIT) diterapkan sepanjang 100 meter sejajar garis pantai — mencatat, mengkategorikan, dan menimbang seluruh sampah makro (>2,5 cm) ke dalam enam kategori ICC: Barang Umum, Alat Tangkap Ikan, Material Kemasan, Kebersihan Diri, Sampah Lainnya, dan Sampah Kecil.',
        readMore: 'Pelajari Metodologi Selengkapnya',
      },

      // CTA
      cta: {
        title: 'Siap Menjaga Laut Indonesia Bersama Kami?',
        subtitle: 'Bergabunglah dengan ribuan relawan dan peneliti. Setiap laporan Anda menjadi langkah nyata menyelamatkan ekosistem laut.',
        buttonPrimary: 'Kirim Laporan Pertama',
        buttonSecondary: 'Buka Dasbor Analisis',
      },

      // Footer
      footer: {
        tagline: 'Platform Pemantauan Sampah Laut Berbasis Komunitas dan Kecerdasan Buatan untuk Nusantara.',
        navigation: 'Navigasi',
        resources: 'Sumber Daya',
        legal: 'Kebijakan',
        aboutUs: 'Tentang Proyek',
        methodology: 'Metodologi',
        apiDocs: 'Dokumentasi Data',
        privacyPolicy: 'Kebijakan Privasi',
        terms: 'Ketentuan Layanan',
        dataLicense: 'Lisensi Data Terbuka',
        copyright: 'Hak Cipta © 2026 Oceaniq Indonesia. Seluruh hak cipta dilindungi undang-undang.',
      },
    },

    // Interactive Map
    map: {
      title: 'Peta Pemantauan Sampah Laut',
      searchPrompt: 'Cari zona pesisir atau lokasi observasi...',
      selectZone: 'Pilih Zona Pesisir',
      allZones: 'Semua Zona',
      experimentalMode: 'Mode Eksperimental ML',
      activeMode: 'Aktif',
      lastUpdated: 'Diperbarui',
      layers: 'Lapisan Peta',
      layerDebris: 'Titik Sampah Laut',
      layerHotspots: 'Zona Akumulasi (Hotspots)',
      layerWeather: 'Stasiun Cuaca Maritim',
      layerHeatmap: 'Peta Kepadatan (Heatmap)',
      legend: 'Legenda Peta',
      severityHigh: 'Kepadatan Sangat Tinggi (> 5.0 kg/m²)',
      severityMedium: 'Kepadatan Sedang (1.5 - 5.0 kg/m²)',
      severityLow: 'Kepadatan Rendah (< 1.5 kg/m²)',
      weatherStation: 'Stasiun Cuaca Maritim',
      clickToInspect: 'Klik titik pada peta untuk melihat rincian observasi',
      recordedSite: 'Lokasi Tercatat',
      pointDetailTitle: 'Rincian Observasi Sampah',
      stationDetailTitle: 'Data Stasiun Cuaca Maritim',
      coordinates: 'Koordinat',
      recordedAt: 'Waktu Observasi',
      compositionBreakdown: 'Komposisi Sampah Terdeteksi',
      plastic: 'Plastik & Polimer',
      organic: 'Organik & Kayu',
      metal: 'Logam & Kaleng',
      glass: 'Kaca & Keramik',
      rubber: 'Karet & Ban',
      other: 'Lainnya',
      windSpeed: 'Kecepatan Angin',
      rainfall: 'Curah Hujan',
      tideLevel: 'Tinggi Pasang Surut',
      temperature: 'Suhu Udara',
      reportedBy: 'Dilaporkan Oleh',
      filterTitle: 'Filter Data Observasi',
      filterTime: 'Rentang Waktu',
      filterSeverity: 'Tingkat Kepadatan',
      filterVerifiedOnly: 'Hanya yang Terverifikasi',
      resetFilters: 'Reset Filter',
      applyFilters: 'Terapkan Filter',
      noDataFound: 'Tidak ada data observasi yang cocok dengan kriteria filter.',
    },

    // Analytics Dashboard
    analytics: {
      title: 'Dasbor Analisis Sampah Maritim',
      subtitle: 'Tren akumulasi sampah, analisis komposisi, dan korelasi cuaca maritim di perairan Indonesia.',
      range7d: '7 Hari Terakhir',
      range30d: '30 Hari Terakhir',
      range90d: '90 Hari Terakhir',
      range6m: '6 Bulan Terakhir',
      range1y: '1 Tahun Terakhir',
      allZones: 'Semua Zona',

      kpiTotalWeight: 'Estimasi Akumulasi Sampah',
      kpiTotalWeightSub: '+12.4% dibandingkan periode lalu',
      kpiHotspots: 'Titik Rawan Aktif',
      kpiHotspotsSub: 'Memerlukan intervensi segera',
      kpiCitizenReports: 'Laporan Warga Tervalidasi',
      kpiCitizenReportsSub: 'Tingkat validasi 94.2%',
      kpiPredictedVolume: 'Prediksi Masukan 30 Hari ke Depan',
      kpiPredictedVolumeSub: 'Berdasarkan ramalan curah hujan BMKG',

      trendChartTitle: 'Tren Densitas Sampah per Zona (kg/m²)',
      trendChartSub: 'Perbandingan observasi aktual lapangan vs proyeksi model XGBoost.',
      actualObservation: 'Observasi Aktual',
      predictedTrend: 'Prediksi Model AI',

      compositionChartTitle: 'Distribusi Komposisi Sampah Laut',
      compositionChartSub: 'Proporsi material sampah berdasarkan klasifikasi UNEP/CSIRO.',

      mlBenchmarkTitle: 'Evaluasi & Akurasi Model Prediktif AI',
      mlBenchmarkSub: 'Performa model XGBoost teroptimasi vs data uji lapangan (MAE, RMSE, R²).',

      rainfallCorrTitle: 'Korelasi Curah Hujan vs Masukan Sampah',
      rainfallCorrSub: 'Hubungan intensitas hujan harian dengan lonjakan volume sampah di muara sungai.',

      dataSourcesTitle: 'Proporsi Sumber Data Monitoring',
      dataSourcesSub: 'Integrasi sains warga, survei saintifik resmi, dan sensor lingkungan.',

      recentActivityTitle: 'Aktivitas & Laporan Terbaru',
      recentActivitySub: 'Laporan masuk dan pembaruan sistem secara langsung.',
    },

    // Leaderboard
    leaderboard: {
      badge: 'Papan Peringkat & Lencana Komunitas',
      title: 'Pahlawan Penjaga Pesisir Indonesia',
      subtitle: 'Apresiasi untuk para pejuang sains warga, pemantau pesisir, dan relawan lingkungan yang mengubah data lapangan menjadi aksi nyata.',
      allTime: 'Peringkat Sepanjang Masa',
      thisMonth: 'Peringkat Bulan Ini',
      rank: 'Peringkat',
      user: 'Nama Kontributor',
      points: 'Total Poin',
      reports: 'Laporan Disetujui',
      badgesEarned: 'Lencana',
      tier: 'Tingkat Kontributor',
      tierGuardian: 'Penjaga Laut Utama (Ocean Guardian)',
      tierAdvocate: 'Pejuang Pesisir (Coastal Advocate)',
      tierRanger: 'Pemantau Pantai (Beach Ranger)',
      tierObserver: 'Pengamat Pemula (Coastal Observer)',
      allBadgesTitle: 'Katalog Lencana Kehormatan',
      allBadgesSub: 'Tuntaskan berbagai misi lingkungan untuk mengumpulkan seluruh lencana.',
    },

    // Contribute
    contribute: {
      badge: 'Laporan Sains Warga Pesisir',
      title: 'Laporkan Sampah Laut & Lindungi Pantai Kita',
      subtitle: 'Tandai lokasi di peta, unggah bukti foto, dan kirimkan data sampah untuk memperkuat model AI serta mendukung aksi mitigasi pencemaran laut.',
      tabCitizen: 'Laporan Ringkas Warga',
      tabExpert: 'Survei Saintifik / Ahli',

      step1: '1. Lokasi & Koordinat',
      step2: '2. Foto Bukti & Estimasi',
      step3: '3. Detail Sampah & Pengiriman',

      siteNameLabel: 'Nama Lokasi / Pantai',
      siteNamePlaceholder: 'contoh: Pantai Ancol, Teluk Jakarta',
      zoneLabel: 'Wilayah / Zona Pesisir',
      selectZonePlaceholder: 'Pilih zona pesisir terdekat',
      coordsHelp: 'Klik pada peta mini atau aktifkan GPS perangkat untuk menetapkan koordinat yang presisi.',
      useCurrentLocation: 'Gunakan Lokasi GPS Saya',

      uploadPhotoLabel: 'Unggah Foto Bukti Sampah',
      uploadPhotoHelp: 'Format JPG/PNG maks. 10MB. Foto yang jelas mempermudah verifikasi tim analis.',
      dragDrop: 'Tarik & lepas foto di sini, atau',
      browseFiles: 'Pilih Berkas',

      wasteDensityLabel: 'Perkiraan Kepadatan Sampah',
      densityLow: 'Ringan (Sampah tersebar jarang)',
      densityMedium: 'Sedang (Akumulasi sporadis)',
      densityHigh: 'Tinggi (Tumpukan masif / lapisan padat)',

      dominantTypeLabel: 'Jenis Sampah Dominan',
      notesLabel: 'Catatan Lapangan Tambahan',
      notesPlaceholder: 'Tuliskan kondisi pantai, sumber kemungkinan sampah, atau situasi khusus...',

      submitButton: 'Kirim Laporan Pemantauan',
      submitting: 'Mengirim Laporan...',
      successTitle: 'Laporan Berhasil Terkirim!',
      successDesc: 'Terima kasih atas kontribusi Anda! Tim analis kami akan memverifikasi laporan ini, dan Anda akan menerima poin kontribusi.',
      reportAnother: 'Kirim Laporan Lainnya',
      viewInDashboard: 'Lihat di Dasbor Saya',
    },

    // User Dashboard
    dashboard: {
      welcome: 'Selamat Datang Kembali,',
      subtitle: 'Pantau status laporan Anda, akumulasi poin, dan dampak nyata aksi pelestarian laut Anda.',
      newReportBtn: 'Buat Laporan Baru',
      totalPoints: 'Poin Kontribusi',
      approvedReports: 'Laporan Terverifikasi',
      estimatedWasteLogged: 'Estimasi Sampah Teridentifikasi',
      currentRank: 'Peringkat Komunitas',
      mySubmissions: 'Riwayat Laporan Saya',
      tabAll: 'Semua Laporan',
      tabApproved: 'Terverifikasi',
      tabPending: 'Dalam Peninjauan',
      tabRejected: 'Perlu Revisi',
      noSubmissions: 'Belum ada laporan yang dikirimkan. Mulai kontribusi pertama Anda sekarang!',
    },

    // Admin Panel
    admin: {
      title: 'Panel Administrasi & Moderasi',
      subtitle: 'Verifikasi laporan sains warga, kelola pengguna sistem, dan ekspor dataset ilmiah.',
      tabPending: 'Laporan Menunggu Verifikasi',
      tabAllReports: 'Semua Data Observasi',
      tabUsers: 'Manajemen Pengguna',
      approveBtn: 'Setujui Laporan',
      rejectBtn: 'Tolak Laporan',
      reviewModalTitle: 'Tinjau Bukti Laporan',
      actionSuccess: 'Tindakan berhasil diproses',
    },

    // Auth
    auth: {
      loginTitle: 'Masuk ke Oceaniq',
      signupTitle: 'Daftar Akun Baru',
      forgotTitle: 'Atur Ulang Kata Sandi',
      emailLabel: 'Alamat Email',
      passwordLabel: 'Kata Sandi',
      fullNameLabel: 'Nama Lengkap',
      loginBtn: 'Masuk Sekarang',
      signupBtn: 'Buat Akun Oceaniq',
      forgotBtn: 'Kirim Tautan Reset',
      backToLogin: 'Kembali ke Halaman Masuk',
      noAccount: 'Belum punya akun?',
      haveAccount: 'Sudah memiliki akun?',
      signUpLink: 'Daftar Sekarang',
      signInLink: 'Masuk di sini',
      forgotPasswordLink: 'Lupa kata sandi?',
    },

    // 404
    notFound: {
      title: 'Halaman Tidak Ditemukan',
      desc: 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke koordinat lain.',
      backHome: 'Kembali ke Beranda',
    }
  },

  en: {
    // Navigation & Common
    nav: {
      home: 'Home',
      about: 'About',
      map: 'Interactive Map',
      analytics: 'Analytics & Data',
      leaderboard: 'Leaderboard',
      dashboard: 'My Dashboard',
      admin: 'Admin Panel',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      contribute: 'Report Waste',
      contributeShort: 'Report',
      notifications: 'Notifications',
      newNotifications: 'new',
      signedInAs: 'Signed in as',
      searchPlaceholder: 'Search zones or sites...',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
    },
    roles: {
      administrator: 'Administrator',
      analyst: 'Verified Analyst',
      contributor: 'Citizen Scientist',
      user: 'User',
    },
    common: {
      loading: 'Loading data...',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      close: 'Close',
      filter: 'Filter',
      refresh: 'Refresh',
      export: 'Export',
      all: 'All',
      viewAll: 'View All',
      details: 'Details',
      status: 'Status',
      date: 'Date',
      location: 'Location',
      zone: 'Zone',
      category: 'Category',
      severity: 'Severity Level',
      verified: 'Verified',
      pending: 'Pending Review',
      rejected: 'Rejected',
      actions: 'Actions',
      confidence: 'Confidence Score',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      kg: 'kg',
      itemsPerM2: 'items/m²',
      gramsPerM2: 'g/m²',
      wib: 'WIB',
    },
    // Landing Page
    landing: {
      badge: 'Indonesia Marine Debris Monitoring Platform',
      heroTitlePrefix: 'Protecting Indonesian Coasts with ',
      heroTitleHighlight: 'Citizen Science & AI',
      heroSubtitle: 'Oceaniq combines field observations, coastal community reports, and ML-powered predictive modeling to monitor and reduce marine debris across Indonesian coastal zones.',
      exploreMap: 'Explore Coastal Map',
      reportWaste: 'Report Marine Waste',
      liveBadge: 'Live Observation Feed',

      // Live Stats Bar
      stats: {
        totalWasteLogged: 'Total Waste Logged',
        monitoredZones: 'Monitored Coastal Zones',
        citizenReports: 'Citizen Science Reports',
        mlAccuracy: 'Mean Absolute Error Model',
        activeHotspots: 'Active Hotspots',
      },

      // Feature Highlights
      features: {
        tag: 'Key Capabilities',
        title: 'Intelligent Technology for Ocean Conservation',
        subtitle: 'A unified platform connecting coastal communities, researchers, and environmental policymakers.',
        f1Title: 'Real-Time Interactive Map',
        f1Desc: 'Visualize debris density distribution, accumulation hotspots, and marine weather stations across Indonesian shores.',
        f2Title: 'AI-Powered Predictive Modeling',
        f2Desc: 'Estimate marine debris influx using historical records, precipitation rates, tidal currents, and oceanic wind patterns.',
        f3Title: 'Citizen Science Reporting',
        f3Desc: 'Rapid GPS and photo-based reporting tailored for coastal citizens, fishermen, and cleanup volunteers.',
        f4Title: 'Debris Composition Analytics',
        f4Desc: 'Deep-dive tracking into macro-plastics, ghost fishing nets, styrofoam, and organic marine waste.',
      },

      // How It Works
      howItWorks: {
        tag: 'Workflow',
        title: 'How Oceaniq Works',
        subtitle: 'From a coastal observation to evidence-based conservation policy.',
        step1Title: '1. Field Observation & Reporting',
        step1Desc: 'Volunteers and researchers take photos and tag debris coordinates during beach cleanup surveys.',
        step2Title: '2. Verification & AI Modeling',
        step2Desc: 'Data is validated by marine analysts and aligned with weather parameters using machine learning algorithms.',
        step3Title: '3. Mapping & Targeted Action',
        step3Desc: 'Hotspots appear on the live map to guide cleanup operations and support regional conservation policies.',
      },

      // Contributor Benefits & Gamification
      benefits: {
        tag: 'Impact & Recognition',
        title: 'Contribute to Cleaner Indonesian Waters',
        subtitle: 'Earn honor badges, contribution points, and become a champion of coastal conservation.',
        b1Title: 'Community Badges & Ranks',
        b1Desc: 'Collect contribution points for verified reports and unlock prestigous Ocean Guardian tiers.',
        b2Title: 'Open Data for Research',
        b2Desc: 'All verified datasets are accessible to researchers, environmental NGOs, and governmental bodies.',
        b3Title: 'Targeted Cleanup Deployments',
        b3Desc: 'Help local communities prioritize the most critical debris accumulation sites efficiently.',
      },

      // Leaderboard Preview
      leaderboardPreview: {
        tag: 'Coastal Defenders',
        title: 'Top Contributors This Week',
        subtitle: 'Honoring active volunteers dedicated to protecting our marine and coastal ecosystems.',
        viewFull: 'View Full Leaderboard',
        points: 'Points',
        reportsCount: 'Reports',
      },

      // Hotspot Alert Banner
      hotspotBanner: {
        tag: 'Critical Hotspot Alert',
        title: 'Waste Accumulation Surge in North Jakarta Bay & Bali Strait',
        desc: 'AI models predict a 35% surge in plastic accumulation due to seasonal rainfall spikes and tidal flow patterns.',
        action: 'View on Map',
      },

      // Methodology Note
      methodology: {
        tag: 'Scientific Transparency',
        title: 'Evidence-Based Methodology',
        desc: 'Oceaniq\'s field data adopts the International Coastal Cleanup (ICC) methodology developed by Ocean Conservancy International, combined with OceanKita litter and environmental records. Surveys apply the Line in Transect (LIT) method — 100 m parallel to the shoreline — collecting, categorising, and weighing all macro debris >2.5 cm across six ICC item categories: Most Likely Found Items, Fishing Gears, Packaging Materials, Personal Hygiene, Other Trash, and Tiny Trash.',
        readMore: 'Learn More About Our Methodology',
      },

      // CTA
      cta: {
        title: 'Ready to Safeguard Indonesian Oceans?',
        subtitle: 'Join thousands of volunteers and researchers. Every report you submit drives tangible ocean conservation.',
        buttonPrimary: 'Submit First Report',
        buttonSecondary: 'Explore Analytics Dashboard',
      },

      // Footer
      footer: {
        tagline: 'Community-Driven & AI-Powered Marine Waste Monitoring for the Indonesian Archipelago.',
        navigation: 'Navigation',
        resources: 'Resources',
        legal: 'Legal',
        aboutUs: 'About Project',
        methodology: 'Methodology',
        apiDocs: 'Data Documentation',
        privacyPolicy: 'Privacy Policy',
        terms: 'Terms of Service',
        dataLicense: 'Open Data License',
        copyright: 'Copyright © 2026 Oceaniq Indonesia. All rights reserved.',
      },
    },

    // Interactive Map
    map: {
      title: 'Marine Waste Monitoring Map',
      searchPrompt: 'Search coastal zones or recorded sites...',
      selectZone: 'Select Coastal Zone',
      allZones: 'All Zones',
      experimentalMode: 'Experimental ML Mode',
      activeMode: 'Active',
      lastUpdated: 'Updated',
      layers: 'Map Layers',
      layerDebris: 'Debris Observations',
      layerHotspots: 'Accumulation Hotspots',
      layerWeather: 'Weather Stations',
      layerHeatmap: 'Density Heatmap',
      legend: 'Map Legend',
      severityHigh: 'High Density (> 5.0 kg/m²)',
      severityMedium: 'Medium Density (1.5 - 5.0 kg/m²)',
      severityLow: 'Low Density (< 1.5 kg/m²)',
      weatherStation: 'Marine Weather Station',
      clickToInspect: 'Click a map marker to inspect observation details',
      recordedSite: 'Recorded Site',
      pointDetailTitle: 'Debris Observation Details',
      stationDetailTitle: 'Weather Station Information',
      coordinates: 'Coordinates',
      recordedAt: 'Observation Time',
      compositionBreakdown: 'Detected Waste Composition',
      plastic: 'Plastics & Polymers',
      organic: 'Organic & Driftwood',
      metal: 'Metals & Cans',
      glass: 'Glass & Ceramic',
      rubber: 'Rubber & Tyres',
      other: 'Other Materials',
      windSpeed: 'Wind Speed',
      rainfall: 'Rainfall Rate',
      tideLevel: 'Tidal Height',
      temperature: 'Air Temperature',
      reportedBy: 'Reported By',
      filterTitle: 'Filter Observation Data',
      filterTime: 'Time Range',
      filterSeverity: 'Severity Level',
      filterVerifiedOnly: 'Verified Reports Only',
      resetFilters: 'Reset Filters',
      applyFilters: 'Apply Filters',
      noDataFound: 'No observation records match the selected filters.',
    },

    // Analytics Dashboard
    analytics: {
      title: 'Marine Debris Analytics Dashboard',
      subtitle: 'Debris trends, material composition, and environmental correlations across Indonesian waters.',
      range7d: 'Last 7 days',
      range30d: 'Last 30 days',
      range90d: 'Last 90 days',
      range6m: 'Last 6 months',
      range1y: 'Last year',
      allZones: 'All Zones',

      kpiTotalWeight: 'Est. Accumulated Waste',
      kpiTotalWeightSub: '+12.4% vs previous period',
      kpiHotspots: 'Active Hotspots',
      kpiHotspotsSub: 'Immediate cleanup recommended',
      kpiCitizenReports: 'Verified Citizen Reports',
      kpiCitizenReportsSub: '94.2% validation accuracy',
      kpiPredictedVolume: '30-Day Influx Forecast',
      kpiPredictedVolumeSub: 'Based on BMKG rainfall modeling',

      trendChartTitle: 'Waste Density Trends by Zone (kg/m²)',
      trendChartSub: 'Actual field observations compared to XGBoost model projections.',
      actualObservation: 'Actual Observation',
      predictedTrend: 'AI Model Prediction',

      compositionChartTitle: 'Marine Waste Material Distribution',
      compositionChartSub: 'Material breakdown according to UNEP/CSIRO standards.',

      mlBenchmarkTitle: 'Predictive Model Evaluation & Benchmarks',
      mlBenchmarkSub: 'Tuned XGBoost performance metrics against field test data (MAE, RMSE, R²).',

      rainfallCorrTitle: 'Precipitation vs Debris Influx Correlation',
      rainfallCorrSub: 'Correlation between daily rainfall volume and riverine debris spikes.',

      dataSourcesTitle: 'Monitoring Data Source Breakdown',
      dataSourcesSub: 'Synergy between citizen science, scientific surveys, and environmental sensors.',

      recentActivityTitle: 'Live Activity & Recent Reports',
      recentActivitySub: 'Real-time submission stream and system updates.',
    },

    // Leaderboard
    leaderboard: {
      badge: 'Community Leaderboard & Badges',
      title: 'Indonesia Coastal Defenders',
      subtitle: 'Recognizing dedicated citizen scientists, coastal monitors, and environmental advocates turning field reports into actionable ocean data.',
      allTime: 'All-Time Leaders',
      thisMonth: 'This Month',
      rank: 'Rank',
      user: 'Contributor',
      points: 'Total Points',
      reports: 'Approved Reports',
      badgesEarned: 'Badges',
      tier: 'Contributor Tier',
      tierGuardian: 'Ocean Guardian',
      tierAdvocate: 'Coastal Advocate',
      tierRanger: 'Beach Ranger',
      tierObserver: 'Coastal Observer',
      allBadgesTitle: 'Honors & Badges Catalog',
      allBadgesSub: 'Complete environmental survey milestones to unlock every badge.',
    },

    // Contribute
    contribute: {
      badge: 'Citizen Science Cleanup Report',
      title: 'Report Marine Waste & Protect Our Oceans',
      subtitle: 'Drop a pin on the map, upload evidence photos, and submit waste observations to power AI monitoring and targeted cleanup efforts.',
      tabCitizen: 'Quick Citizen Report',
      tabExpert: 'Scientific Survey / Expert',

      step1: '1. Location & Pin',
      step2: '2. Photos & Estimation',
      step3: '3. Classification & Submit',

      siteNameLabel: 'Location / Beach Name',
      siteNamePlaceholder: 'e.g., Ancol Beach, North Jakarta Bay',
      zoneLabel: 'Coastal Region / Zone',
      selectZonePlaceholder: 'Select nearest coastal zone',
      coordsHelp: 'Click on the interactive mini-map or enable GPS to pin exact observation coordinates.',
      useCurrentLocation: 'Use My GPS Location',

      uploadPhotoLabel: 'Upload Debris Photos',
      uploadPhotoHelp: 'JPG/PNG up to 10MB. Clear photos help analysts quickly verify data.',
      dragDrop: 'Drag and drop evidence photos here, or',
      browseFiles: 'Browse Files',

      wasteDensityLabel: 'Estimated Debris Density',
      densityLow: 'Low (Scattered individual items)',
      densityMedium: 'Medium (Sparse patches / clusters)',
      densityHigh: 'High (Dense accumulation / continuous layer)',

      dominantTypeLabel: 'Dominant Material Type',
      notesLabel: 'Field Notes & Observations',
      notesPlaceholder: 'Describe weather, suspected waste origins, or special site conditions...',

      submitButton: 'Submit Observation Report',
      submitting: 'Submitting Report...',
      successTitle: 'Report Successfully Submitted!',
      successDesc: 'Thank you for your valuable contribution! Our analyst team will verify the report, and points will be credited to your profile.',
      reportAnother: 'Submit Another Report',
      viewInDashboard: 'View in My Dashboard',
    },

    // User Dashboard
    dashboard: {
      welcome: 'Welcome back,',
      subtitle: 'Track your submitted reports, earned badges, and tangible contribution to Indonesian marine health.',
      newReportBtn: 'Submit New Report',
      totalPoints: 'Contribution Points',
      approvedReports: 'Verified Reports',
      estimatedWasteLogged: 'Identified Waste Volume',
      currentRank: 'Community Rank',
      mySubmissions: 'My Submissions',
      tabAll: 'All Reports',
      tabApproved: 'Approved',
      tabPending: 'Pending Review',
      tabRejected: 'Needs Revision',
      noSubmissions: 'No reports submitted yet. Submit your first observation today!',
    },

    // Admin Panel
    admin: {
      title: 'Administration & Moderasi Panel',
      subtitle: 'Review incoming citizen reports, manage user roles, and export scientific datasets.',
      tabPending: 'Pending Moderation',
      tabAllReports: 'All Observations',
      tabUsers: 'User Management',
      approveBtn: 'Approve Report',
      rejectBtn: 'Reject Report',
      reviewModalTitle: 'Inspect Submission Evidence',
      actionSuccess: 'Action processed successfully',
    },

    // Auth
    auth: {
      loginTitle: 'Sign In to Oceaniq',
      signupTitle: 'Create New Account',
      forgotTitle: 'Reset Your Password',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      fullNameLabel: 'Full Name',
      loginBtn: 'Sign In',
      signupBtn: 'Create Oceaniq Account',
      forgotBtn: 'Send Reset Link',
      backToLogin: 'Back to Sign In',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signUpLink: 'Sign Up',
      signInLink: 'Sign In here',
      forgotPasswordLink: 'Forgot password?',
    },

    // 404
    notFound: {
      title: 'Page Not Found',
      desc: 'The page you are looking for does not exist or has drifted to different coordinates.',
      backHome: 'Back to Home',
    }
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string;
};

export type Translations = DeepString<typeof translations.id>;
