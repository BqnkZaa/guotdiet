/**
 * Site-wide configuration constants
 * Used for metadata, SEO, and app-level branding
 */
export const siteConfig = {
  name: 'GoutDiet',
  nameTh: 'กาวท์ไดเอท',
  description: 'ระบบควบคุมอาหารและติดตามระดับกรดยูริกสำหรับผู้ป่วยโรคเกาต์',
  descriptionEn: 'Gout-friendly diet tracking and uric acid monitoring platform',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
  keywords: [
    'โรคเกาต์',
    'กรดยูริก',
    'อาหารสำหรับโรคเกาต์',
    'ควบคุมพิวรีน',
    'gout diet',
    'uric acid',
    'purine control',
    'health tracker',
  ],
  links: {
    github: 'https://github.com',
  },
  // Medical disclaimer — always display this
  disclaimer:
    'ข้อมูลในแอปพลิเคชันนี้มีวัตถุประสงค์เพื่อให้ความรู้ทั่วไปเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ กรุณาปรึกษาแพทย์ก่อนเปลี่ยนแปลงอาหารหรือวิถีชีวิต',
} as const

export type SiteConfig = typeof siteConfig
