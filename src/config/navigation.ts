import { type LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Salad,
  ClipboardList,
  DropletIcon,
  Settings,
  BookOpen,
} from 'lucide-react'

export interface NavItem {
  label: string
  labelEn: string
  href: string
  icon: LucideIcon
  description?: string
}

/**
 * Main navigation links — shown in Navbar & Sidebar
 */
export const mainNavItems: NavItem[] = [
  {
    label: 'แดชบอร์ด',
    labelEn: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'ภาพรวมสุขภาพและการรับประทานอาหาร',
  },
  {
    label: 'บันทึกอาหาร',
    labelEn: 'Meal Log',
    href: '/meals',
    icon: ClipboardList,
    description: 'บันทึกมื้ออาหารประจำวัน',
  },
  {
    label: 'ฐานข้อมูลอาหาร',
    labelEn: 'Food Database',
    href: '/foods',
    icon: Salad,
    description: 'ค้นหาข้อมูลพิวรีนในอาหาร',
  },
  {
    label: 'ระดับกรดยูริก',
    labelEn: 'Uric Acid',
    href: '/uric-acid',
    icon: DropletIcon,
    description: 'ติดตามระดับกรดยูริกในเลือด',
  },
  {
    label: 'คู่มือโรคเกาต์',
    labelEn: 'Guide',
    href: '/guide',
    icon: BookOpen,
    description: 'ข้อมูลและคำแนะนำเกี่ยวกับโรคเกาต์',
  },
]

/**
 * User menu items — shown in dropdown after login
 */
export const userNavItems = [
  { label: 'โปรไฟล์', href: '/profile' },
  { label: 'ตั้งค่า', href: '/settings' },
] as const

/**
 * Footer navigation links
 */
export const footerNavItems = [
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
  { label: 'เงื่อนไขการใช้งาน', href: '/terms' },
  { label: 'ติดต่อเรา', href: '/contact' },
] as const
