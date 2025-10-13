export interface Article {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  isRead: boolean
}

export interface NewsSource {
  id: string
  name: string
  url: string
  isActive: boolean
}

export type PlantType = 'tomato' | 'carrot' | 'lettuce' | null

export interface Plot {
  id: number
  plantType: PlantType
  plantedAt: string | null
  isGrown: boolean
}

export interface Garden {
  plots: Plot[]
}