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