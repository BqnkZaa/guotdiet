import { PurineLevel } from '@prisma/client'

export interface MealItemInput {
  foodId: string
  name: string
  purinePerHg: number // mg of purine per 100g
  amountGrams: number
  category: string
}

export interface RecommendationCard {
  title: string
  message: string
  type: 'success' | 'warning' | 'danger' | 'info'
}

/**
 * Calculates total purine for a given meal list based on weight.
 * Formula: Sum of ((weight / 100) * purine_per_100g)
 */
export function calculateTotalPurine(items: MealItemInput[]): number {
  return items.reduce((total, item) => {
    return total + (item.amountGrams / 100) * item.purinePerHg
  }, 0)
}

/**
 * Classifies the risk level of an individual food based on its purine per 100g.
 */
export function classifyFoodRiskLevel(purinePerHg: number): PurineLevel {
  if (purinePerHg > 300) return 'VERY_HIGH'
  if (purinePerHg >= 150) return 'HIGH'
  if (purinePerHg >= 50) return 'MODERATE'
  return 'LOW'
}

/**
 * Generates rule-based recommendations for a meal based on its total purine content
 * and the types of foods included.
 * 
 * Rules:
 * 1. If meal total > 400mg -> Danger (Exceeds daily recommended limit in one meal)
 * 2. If meal total > 200mg -> Warning (High for a single meal)
 * 3. If contains VERY_HIGH purine food -> Warning to limit portion
 * 4. If high in vegetables/low purine -> Positive reinforcement
 * 5. General hydration reminder
 */
export function generateMealRecommendations(
  totalPurineMg: number,
  items: MealItemInput[]
): RecommendationCard[] {
  const recommendations: RecommendationCard[] = []

  // Rule 1 & 2: Total Meal Purine Rules
  if (totalPurineMg > 400) {
    recommendations.push({
      title: 'ระดับพิวรีนสูงมาก',
      message: 'มื้อนี้มีปริมาณพิวรีนเกินเป้าหมายที่แนะนำต่อวัน (400 มก.) ควรระมัดระวังและดื่มน้ำตามมากๆ',
      type: 'danger',
    })
  } else if (totalPurineMg > 200) {
    recommendations.push({
      title: 'ระดับพิวรีนค่อนข้างสูง',
      message: 'มื้อนี้ใช้โควตาพิวรีนไปมากกว่าครึ่งหนึ่งของวันแล้ว มื้อถัดไปควรเน้นอาหารพิวรีนต่ำ',
      type: 'warning',
    })
  } else if (totalPurineMg > 0) {
    recommendations.push({
      title: 'ระดับพิวรีนปลอดภัย',
      message: 'ปริมาณพิวรีนในมื้อนี้อยู่ในเกณฑ์ที่ดี สามารถรับประทานได้อย่างสบายใจ',
      type: 'success',
    })
  }

  // Rule 3: Very High Purine Items detection
  const veryHighItems = items.filter((i) => classifyFoodRiskLevel(i.purinePerHg) === 'VERY_HIGH')
  if (veryHighItems.length > 0) {
    const names = veryHighItems.map(i => i.name).join(', ')
    recommendations.push({
      title: 'มีอาหารกลุ่มเสี่ยงสูง',
      message: `มื้อนี้มีอาหารพิวรีนสูงมาก ได้แก่ ${names} หากเลี่ยงไม่ได้ ควรจำกัดปริมาณการรับประทานให้น้อยที่สุด`,
      type: 'danger',
    })
  }

  // Rule 4: High Purine Items detection (if no very high items are present to avoid spam)
  if (veryHighItems.length === 0) {
    const highItems = items.filter((i) => classifyFoodRiskLevel(i.purinePerHg) === 'HIGH')
    if (highItems.length > 0) {
      recommendations.push({
        title: 'มีอาหารควรระวัง',
        message: 'มื้อนี้มีอาหารกลุ่มพิวรีนสูงรวมอยู่ด้วย ควรรับประทานในปริมาณที่พอเหมาะ',
        type: 'warning',
      })
    }
  }

  // Rule 5: Positive reinforcement for veggies
  const hasVeggies = items.some((i) => i.category === 'VEGETABLES')
  if (hasVeggies && totalPurineMg <= 200) {
    recommendations.push({
      title: 'เยี่ยมมาก',
      message: 'การรับประทานผักและอาหารพิวรีนต่ำช่วยรักษาสมดุลกรดยูริกในร่างกายได้ดี',
      type: 'success',
    })
  }

  // Rule 6: Multiple high risk items
  const highRiskCount = items.filter(i => classifyFoodRiskLevel(i.purinePerHg) === 'HIGH' || classifyFoodRiskLevel(i.purinePerHg) === 'VERY_HIGH').length
  if (highRiskCount >= 2) {
    recommendations.push({
      title: '⚠️ ความเสี่ยงสะสม (อันตราย)',
      message: 'มีการรวมอาหารพิวรีนสูงและสูงมากหลายชนิดในมื้อเดียว เสี่ยงต่อการเกิดข้ออักเสบเฉียบพลัน ควรงดการจับคู่นี้ในอนาคต',
      type: 'danger',
    })
  }

  // Rule 7: Always recommend hydration
  if (items.length > 0) {
    recommendations.push({
      title: 'ข้อแนะนำเพิ่มเติม',
      message: 'อย่าลืมดื่มน้ำเปล่าให้เพียงพอ (2-3 ลิตรต่อวัน) เพื่อช่วยขับกรดยูริกออกจากร่างกาย',
      type: 'info',
    })
  }

  return recommendations
}
