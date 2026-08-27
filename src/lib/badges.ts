export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'milestone' | 'impact' | 'exploration' | 'quality';
  color: string;
  bgColor: string;
  borderColor: string;
  requirementText: string;
  unlocked: boolean;
  progressPercent: number;
}

export interface UserTier {
  name: string;
  level: number;
  badgeIcon: string;
  color: string;
  nextTierName?: string;
  reportsNeededForNextTier: number;
}

export function getAllBadges(verifiedReportsCount: number, totalKg: number, uniqueSites: number, hasPlastic: boolean, lang: 'id' | 'en' = 'id'): Badge[] {
  const isId = lang === 'id';
  return [
    {
      id: 'coast-scout',
      title: isId ? 'Coast Scout' : 'Coast Scout',
      icon: '🛡️',
      description: isId ? 'Mengirimkan laporan terverifikasi pertama Anda.' : 'Submitted your first verified coastal report.',
      category: 'milestone',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      requirementText: isId ? '1 laporan terverifikasi' : '1 verified report',
      unlocked: verifiedReportsCount >= 1,
      progressPercent: Math.min(100, (verifiedReportsCount / 1) * 100),
    },
    {
      id: 'tide-master',
      title: isId ? 'Tide Master' : 'Tide Master',
      icon: '🌊',
      description: isId ? 'Mengirimkan 5 laporan observasi terverifikasi.' : 'Submitted 5 verified observation reports.',
      category: 'milestone',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      requirementText: isId ? '5 laporan terverifikasi' : '5 verified reports',
      unlocked: verifiedReportsCount >= 5,
      progressPercent: Math.min(100, (verifiedReportsCount / 5) * 100),
    },
    {
      id: 'ocean-guardian',
      title: isId ? 'Ocean Guardian' : 'Ocean Guardian',
      icon: '🐬',
      description: isId ? 'Kontributor berdedikasi dengan 10+ laporan terverifikasi.' : 'Dedicated contributor with 10+ verified reports.',
      category: 'milestone',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      requirementText: isId ? '10 laporan terverifikasi' : '10 verified reports',
      unlocked: verifiedReportsCount >= 10,
      progressPercent: Math.min(100, (verifiedReportsCount / 10) * 100),
    },
    {
      id: 'plastic-hunter',
      title: isId ? 'Plastic Hunter' : 'Plastic Hunter',
      icon: '♻️',
      description: isId ? 'Melaporkan temuan sampah plastik dalam survei lapangan.' : 'Reported plastic pollution items in field surveys.',
      category: 'impact',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      requirementText: isId ? 'Dokumentasi sampah plastik' : 'Document plastic waste',
      unlocked: verifiedReportsCount >= 1 && hasPlastic,
      progressPercent: hasPlastic && verifiedReportsCount >= 1 ? 100 : (verifiedReportsCount >= 1 ? 50 : 0),
    },
    {
      id: 'expedition-specialist',
      title: isId ? 'Expedition Specialist' : 'Expedition Specialist',
      icon: '📍',
      description: isId ? 'Survei dan dokumentasi sampah di 3+ lokasi pesisir unik.' : 'Surveyed and documented marine waste across 3+ unique coastal sites.',
      category: 'exploration',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      requirementText: isId ? '3 lokasi unik' : '3 unique sites',
      unlocked: uniqueSites >= 3,
      progressPercent: Math.min(100, (uniqueSites / 3) * 100),
    },
    {
      id: 'verification-hero',
      title: isId ? 'Verification Hero' : 'Verification Hero',
      icon: '⚡',
      description: isId ? 'Data observasi disetujui oleh moderator ahli.' : 'Had observation data approved by expert moderators.',
      category: 'quality',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      requirementText: isId ? 'Lulus tinjauan ahli' : 'Passed expert review',
      unlocked: verifiedReportsCount >= 1,
      progressPercent: verifiedReportsCount >= 1 ? 100 : 0,
    },
  ];
}

export function getUserTier(verifiedReportsCount: number, lang: 'id' | 'en' = 'id'): UserTier {
  const isId = lang === 'id';
  if (verifiedReportsCount >= 10) {
    return {
      name: 'Platinum Guardian',
      level: 4,
      badgeIcon: '💎',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      reportsNeededForNextTier: 0,
    };
  } else if (verifiedReportsCount >= 6) {
    return {
      name: 'Gold Defender',
      level: 3,
      badgeIcon: '🥇',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      nextTierName: 'Platinum Guardian',
      reportsNeededForNextTier: 10 - verifiedReportsCount,
    };
  } else if (verifiedReportsCount >= 3) {
    return {
      name: 'Silver Monitor',
      level: 2,
      badgeIcon: '🥈',
      color: 'text-slate-300 bg-slate-500/10 border-slate-500/30',
      nextTierName: 'Gold Defender',
      reportsNeededForNextTier: 6 - verifiedReportsCount,
    };
  } else {
    return {
      name: 'Bronze Scout',
      level: 1,
      badgeIcon: '🥉',
      color: 'text-amber-600 bg-amber-600/10 border-amber-600/30',
      nextTierName: 'Silver Monitor',
      reportsNeededForNextTier: 3 - verifiedReportsCount,
    };
  }
}

export function getPostSubmissionEncouragement(pendingCount: number, verifiedCount: number): {
  title: string;
  message: string;
  nextBadgeName: string;
  nextBadgeIcon: string;
} {
  const totalVerified = verifiedCount;
  
  if (totalVerified === 0) {
    return {
      title: '🎉 Report Submitted & Pending Verification!',
      message: 'You are just 1 step away from unlocking your Coast Scout badge (🛡️) as soon as our moderators verify your report!',
      nextBadgeName: 'Coast Scout',
      nextBadgeIcon: '🛡️',
    };
  } else if (totalVerified < 5) {
    const remaining = 5 - totalVerified;
    return {
      title: '🎉 Observation Logged!',
      message: `Your report is in review! Once verified, you'll be ${remaining} verified report${remaining > 1 ? 's' : ''} away from unlocking Tide Master (🌊)!`,
      nextBadgeName: 'Tide Master',
      nextBadgeIcon: '🌊',
    };
  } else if (totalVerified < 10) {
    const remaining = 10 - totalVerified;
    return {
      title: '🎉 Field Report Submitted!',
      message: `Awesome work! Once verified, you'll be only ${remaining} report${remaining > 1 ? 's' : ''} away from reaching Ocean Guardian (🐬)!`,
      nextBadgeName: 'Ocean Guardian',
      nextBadgeIcon: '🐬',
    };
  } else {
    return {
      title: '🎉 Contribution Sent!',
      message: 'Thank you for protecting our marine ecosystem! Your report is being processed by expert moderators.',
      nextBadgeName: 'Legendary Contributor',
      nextBadgeIcon: '👑',
    };
  }
}
