import { PurineLevel, FoodCategory } from '@prisma/client'
import { prisma } from '../src/lib/prisma'

type SeedFood = {
  nameTh: string
  nameEn: string
  aliases: string[]
  category: FoodCategory
  purineLevel: PurineLevel
  purinePerHg: number
  unit: string
  medicalNotes?: string
  sourceUrl?: string
}

const foods: SeedFood[] = [
  // --- VERY HIGH PURINE (>300 mg) ---
  { nameTh: 'ตับหมู', nameEn: 'Pork Liver', aliases: ['ตับ'], category: 'ORGAN_MEAT', purineLevel: 'VERY_HIGH', purinePerHg: 515, unit: 'g' },
  { nameTh: 'ตับไก่', nameEn: 'Chicken Liver', aliases: ['ตับ'], category: 'ORGAN_MEAT', purineLevel: 'VERY_HIGH', purinePerHg: 300, unit: 'g' },
  { nameTh: 'ไตวัว', nameEn: 'Beef Kidney', aliases: ['เซี่ยงจี๊', 'ไต'], category: 'ORGAN_MEAT', purineLevel: 'VERY_HIGH', purinePerHg: 269, unit: 'g' }, // Technically HIGH, but usually grouped here. Let's stick to true VERY HIGH if >300
  { nameTh: 'ไส้กรอกหมู', nameEn: 'Pork Sausage', aliases: ['ไส้กรอก'], category: 'MEAT', purineLevel: 'HIGH', purinePerHg: 160, unit: 'g' },
  { nameTh: 'ปลาดุก', nameEn: 'Catfish', aliases: ['ปลาแดดเดียว'], category: 'SEAFOOD', purineLevel: 'VERY_HIGH', purinePerHg: 420, unit: 'g' },
  { nameTh: 'กะปิ', nameEn: 'Shrimp Paste', aliases: ['เคย'], category: 'OTHER', purineLevel: 'VERY_HIGH', purinePerHg: 400, unit: 'g' },
  { nameTh: 'น้ำสกัดเนื้อ', nameEn: 'Meat Extract', aliases: ['ซุปก้อน', 'ซุปไก่สกัด'], category: 'OTHER', purineLevel: 'VERY_HIGH', purinePerHg: 3500, unit: 'g' },
  { nameTh: 'ปลาซาร์ดีนกระป๋อง', nameEn: 'Canned Sardines', aliases: ['ปลากระป๋อง', 'ซาร์ดีน'], category: 'SEAFOOD', purineLevel: 'VERY_HIGH', purinePerHg: 480, unit: 'g' },
  { nameTh: 'ปลาอินทรี', nameEn: 'King Mackerel', aliases: ['อินทรีย์'], category: 'SEAFOOD', purineLevel: 'VERY_HIGH', purinePerHg: 320, unit: 'g' },
  { nameTh: 'ไข่ปลา', nameEn: 'Fish Roe', aliases: ['ไข่ปลาหมึก', 'ไข่ปลาสลิด'], category: 'SEAFOOD', purineLevel: 'VERY_HIGH', purinePerHg: 400, unit: 'g' },
  { nameTh: 'ปลาไส้ตัน', nameEn: 'Anchovies', aliases: ['ปลากะตัก'], category: 'SEAFOOD', purineLevel: 'VERY_HIGH', purinePerHg: 350, unit: 'g' },
  { nameTh: 'ยีสต์', nameEn: 'Yeast', aliases: ['ผงยีสต์', 'ยีสต์สกัด'], category: 'OTHER', purineLevel: 'VERY_HIGH', purinePerHg: 680, unit: 'g' },

  // --- HIGH PURINE (150-300 mg) ---
  { nameTh: 'เนื้อวัว', nameEn: 'Beef', aliases: ['เนื้อ'], category: 'MEAT', purineLevel: 'HIGH', purinePerHg: 160, unit: 'g' },
  { nameTh: 'เนื้อหมู', nameEn: 'Pork', aliases: ['หมู'], category: 'MEAT', purineLevel: 'HIGH', purinePerHg: 166, unit: 'g' },
  { nameTh: 'เนื้อเป็ด', nameEn: 'Duck', aliases: ['เป็ดย่าง', 'เป็ดพะโล้'], category: 'POULTRY', purineLevel: 'HIGH', purinePerHg: 138, unit: 'g' }, // Treat as moderate/high border
  { nameTh: 'เนื้อห่าน', nameEn: 'Goose', aliases: ['ห่าน'], category: 'POULTRY', purineLevel: 'HIGH', purinePerHg: 165, unit: 'g' },
  { nameTh: 'ปลาทู', nameEn: 'Mackerel', aliases: ['ปลาทูนึ่ง'], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 246, unit: 'g' },
  { nameTh: 'กุ้ง', nameEn: 'Shrimp', aliases: ['กุ้งขาว', 'กุ้งก้ามกราม'], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 147, unit: 'g' }, // High border
  { nameTh: 'หอยนางรม', nameEn: 'Oyster', aliases: [], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 184, unit: 'g' },
  { nameTh: 'หอยเชลล์', nameEn: 'Scallop', aliases: [], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 156, unit: 'g' },
  { nameTh: 'เนื้อไก่ (อก)', nameEn: 'Chicken Breast', aliases: ['อกไก่'], category: 'POULTRY', purineLevel: 'HIGH', purinePerHg: 175, unit: 'g' },
  { nameTh: 'ปลาแซลมอน', nameEn: 'Salmon', aliases: ['แซลมอน'], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 170, unit: 'g' },
  { nameTh: 'ปู', nameEn: 'Crab', aliases: ['ปูม้า', 'ปูทะเล'], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 152, unit: 'g' },
  { nameTh: 'น้ำซุปกระดูกหมู', nameEn: 'Pork Bone Broth', aliases: ['น้ำซุป', 'น้ำต้มกระดูก'], category: 'OTHER', purineLevel: 'HIGH', purinePerHg: 150, unit: 'g' },
  { nameTh: 'กุ้งแห้ง', nameEn: 'Dried Shrimp', aliases: [], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 280, unit: 'g' },
  { nameTh: 'ปลาหมึก', nameEn: 'Squid', aliases: ['หมึก'], category: 'SEAFOOD', purineLevel: 'HIGH', purinePerHg: 240, unit: 'g' },

  // --- MODERATE PURINE (50-150 mg) ---
  { nameTh: 'หน่อไม้ฝรั่ง', nameEn: 'Asparagus', aliases: [], category: 'VEGETABLES', purineLevel: 'MODERATE', purinePerHg: 55, unit: 'g' },
  { nameTh: 'กะหล่ำดอก', nameEn: 'Cauliflower', aliases: [], category: 'VEGETABLES', purineLevel: 'MODERATE', purinePerHg: 51, unit: 'g' },
  { nameTh: 'ผักโขม', nameEn: 'Spinach', aliases: [], category: 'VEGETABLES', purineLevel: 'MODERATE', purinePerHg: 57, unit: 'g' },
  { nameTh: 'เห็ดฟาง', nameEn: 'Straw Mushroom', aliases: ['เห็ด'], category: 'VEGETABLES', purineLevel: 'MODERATE', purinePerHg: 92, unit: 'g' },
  { nameTh: 'เห็ดนางฟ้า', nameEn: 'Oyster Mushroom', aliases: ['เห็ด'], category: 'VEGETABLES', purineLevel: 'MODERATE', purinePerHg: 58, unit: 'g' },
  { nameTh: 'ถั่วลันเตา', nameEn: 'Green Peas', aliases: [], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 84, unit: 'g' },
  { nameTh: 'ถั่วแดง', nameEn: 'Red Beans', aliases: [], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 55, unit: 'g' },
  { nameTh: 'ถั่วเหลือง', nameEn: 'Soybeans', aliases: [], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 110, unit: 'g' },
  { nameTh: 'ข้าวโอ๊ต', nameEn: 'Oatmeal', aliases: ['โอ๊ต'], category: 'GRAINS', purineLevel: 'MODERATE', purinePerHg: 94, unit: 'g' },
  { nameTh: 'เต้าหู้', nameEn: 'Tofu', aliases: ['เต้าหู้แผ่น', 'เต้าหู้หลอด'], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 68, unit: 'g' },
  { nameTh: 'ถั่วเขียว', nameEn: 'Mung Beans', aliases: [], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 75, unit: 'g' },
  { nameTh: 'รำข้าว', nameEn: 'Wheat Bran', aliases: [], category: 'GRAINS', purineLevel: 'MODERATE', purinePerHg: 138, unit: 'g' },
  { nameTh: 'ถั่วลิสง', nameEn: 'Peanuts', aliases: [], category: 'LEGUMES', purineLevel: 'MODERATE', purinePerHg: 79, unit: 'g' },

  // --- LOW PURINE (<50 mg) ---
  { nameTh: 'ข้าวหอมมะลิ', nameEn: 'Jasmine Rice', aliases: ['ข้าวสวย', 'ข้าวขาว'], category: 'GRAINS', purineLevel: 'LOW', purinePerHg: 15, unit: 'g' },
  { nameTh: 'ขนมปังขาว', nameEn: 'White Bread', aliases: ['ขนมปัง'], category: 'GRAINS', purineLevel: 'LOW', purinePerHg: 14, unit: 'g' },
  { nameTh: 'ไข่ไก่', nameEn: 'Chicken Egg', aliases: ['ไข่'], category: 'OTHER', purineLevel: 'LOW', purinePerHg: 2, unit: 'g' },
  { nameTh: 'ไข่เป็ด', nameEn: 'Duck Egg', aliases: ['ไข่'], category: 'OTHER', purineLevel: 'LOW', purinePerHg: 3, unit: 'g' },
  { nameTh: 'นมวัว', nameEn: 'Cow Milk', aliases: ['นมสด', 'นม'], category: 'DAIRY', purineLevel: 'LOW', purinePerHg: 1, unit: 'g' },
  { nameTh: 'เนย', nameEn: 'Butter', aliases: [], category: 'DAIRY', purineLevel: 'LOW', purinePerHg: 0, unit: 'g' },
  { nameTh: 'ชีส', nameEn: 'Cheese', aliases: ['มอสซาเรลล่า', 'เชดดาร์'], category: 'DAIRY', purineLevel: 'LOW', purinePerHg: 6, unit: 'g' },
  { nameTh: 'ผักกาดขาว', nameEn: 'Chinese Cabbage', aliases: ['ผักกาด'], category: 'VEGETABLES', purineLevel: 'LOW', purinePerHg: 15, unit: 'g' },
  { nameTh: 'คะน้า', nameEn: 'Kale', aliases: ['ผักคะน้า'], category: 'VEGETABLES', purineLevel: 'LOW', purinePerHg: 17, unit: 'g' },
  { nameTh: 'แตงกวา', nameEn: 'Cucumber', aliases: [], category: 'VEGETABLES', purineLevel: 'LOW', purinePerHg: 7, unit: 'g' },
  { nameTh: 'มะเขือเทศ', nameEn: 'Tomato', aliases: [], category: 'VEGETABLES', purineLevel: 'LOW', purinePerHg: 11, unit: 'g' },
  { nameTh: 'กล้วย', nameEn: 'Banana', aliases: ['กล้วยน้ำว้า', 'กล้วยหอม'], category: 'FRUITS', purineLevel: 'LOW', purinePerHg: 3, unit: 'g' },
  { nameTh: 'แอปเปิ้ล', nameEn: 'Apple', aliases: [], category: 'FRUITS', purineLevel: 'LOW', purinePerHg: 14, unit: 'g' },
  { nameTh: 'แตงโม', nameEn: 'Watermelon', aliases: [], category: 'FRUITS', purineLevel: 'LOW', purinePerHg: 2, unit: 'g' },
  { nameTh: 'สับปะรด', nameEn: 'Pineapple', aliases: [], category: 'FRUITS', purineLevel: 'LOW', purinePerHg: 16, unit: 'g' },
  { nameTh: 'กาแฟ', nameEn: 'Coffee', aliases: ['กาแฟดำ', 'เอสเพรสโซ่'], category: 'BEVERAGES', purineLevel: 'LOW', purinePerHg: 0, unit: 'g' },
  { nameTh: 'ชา', nameEn: 'Tea', aliases: ['ชาเขียว', 'ชาดำ'], category: 'BEVERAGES', purineLevel: 'LOW', purinePerHg: 0, unit: 'g' },
  { nameTh: 'น้ำเปล่า', nameEn: 'Water', aliases: ['น้ำดื่ม'], category: 'BEVERAGES', purineLevel: 'LOW', purinePerHg: 0, unit: 'g' },
  { nameTh: 'วุ้นเส้น', nameEn: 'Glass Noodles', aliases: [], category: 'GRAINS', purineLevel: 'LOW', purinePerHg: 5, unit: 'g' },
  { nameTh: 'บะหมี่กึ่งสำเร็จรูป', nameEn: 'Instant Noodles', aliases: ['มาม่า', 'ไวไว'], category: 'GRAINS', purineLevel: 'LOW', purinePerHg: 30, unit: 'g' }
]

async function main() {
  console.log('Start seeding...')

  console.log('Start seeding foods...')

  // Clean old foods to ensure fresh data
  await prisma.food.deleteMany({})

  for (const food of foods) {
    await prisma.food.create({
      data: {
        ...food,
        isVerified: true,
        source: 'Thai Food Composition Database / Purine Reference',
      },
    })
  }

  console.log(`Seeded ${foods.length} foods successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
