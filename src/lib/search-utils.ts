export function normalizeThaiText(text: string): string {
  if (!text) return ''
  
  return text
    // Remove extra whitespaces
    .trim()
    .replace(/\s+/g, ' ')
    // Convert to lower case (helps with English characters mixed with Thai)
    .toLowerCase()
    // Normalize zero-width spaces or weird characters if any
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
}

export function generateSearchVariations(query: string): string[] {
  const normalized = normalizeThaiText(query)
  if (!normalized) return []

  const variations = new Set<string>()
  variations.add(normalized)

  // Example heuristic: if the query contains "กุ้ง" and something else, maybe split
  // but for MVP, we just use the normalized string as the base.
  
  // Handling English common typos or Thai mapping could be added here
  const commonTypos: Record<string, string> = {
    'shrimp': 'กุ้ง',
    'prawn': 'กุ้ง',
    'squid': 'หมึก',
    'chicken': 'ไก่',
    'pork': 'หมู',
    'beef': 'เนื้อวัว',
    'rice': 'ข้าว',
  }

  // If the query exactly matches a known English keyword, map it to Thai
  if (commonTypos[normalized]) {
    variations.add(commonTypos[normalized])
  }

  // Also split by space and return individual words for partial matching
  const words = normalized.split(' ')
  if (words.length > 1) {
    words.forEach(word => {
      if (word.length > 2) variations.add(word)
    })
  }

  return Array.from(variations)
}
