import { Article, NewsSource } from './types'

/**
 * Fetches and parses RSS feeds from news sources to get real articles
 * Uses CORS proxy to handle cross-origin requests to RSS feeds
 */
export async function fetchArticlesFromSources(sources: NewsSource[]): Promise<Article[]> {
  const activeSources = sources.filter(s => s.isActive)
  
  if (activeSources.length === 0) {
    throw new Error('No active sources configured')
  }

  const allArticles: Article[] = []
  
  // Fetch articles from each source
  for (const source of activeSources) {
    try {
      const articles = await fetchArticlesFromRSS(source)
      allArticles.push(...articles)
    } catch (error) {
      console.warn(`Failed to fetch from ${source.name}:`, error)
      // Continue with other sources even if one fails
    }
  }

  if (allArticles.length === 0) {
    throw new Error('Failed to fetch articles from any source')
  }

  // Sort by publication date (newest first) and return top 2
  const sortedArticles = allArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2)

  return sortedArticles
}

/**
 * Fetches and parses a single RSS feed
 */
async function fetchArticlesFromRSS(source: NewsSource): Promise<Article[]> {
  // Use a CORS proxy service to fetch RSS feeds
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`
  
  try {
    const response = await fetch(proxyUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error(`RSS parsing error: ${data.message || 'Unknown error'}`)
    }

    // Convert RSS items to our Article format
    const articles: Article[] = data.items.map((item: any, index: number) => ({
      id: `${source.id}-${Date.now()}-${index}`,
      title: cleanText(item.title || 'Untitled'),
      summary: cleanText(item.description || item.content || 'No summary available'),
      url: item.link || item.guid || '#',
      source: source.name,
      publishedAt: item.pubDate || new Date().toISOString(),
      isRead: false
    }))

    return articles.slice(0, 3) // Take top 3 from each source
  } catch (error) {
    console.error(`Error fetching RSS from ${source.name}:`, error)
    throw error
  }
}

/**
 * Cleans HTML tags and entities from text content
 */
function cleanText(text: string): string {
  if (!text) return ''
  
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '')
  
  // Decode common HTML entities
  const htmlEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–'
  }
  
  Object.entries(htmlEntities).forEach(([entity, char]) => {
    cleaned = cleaned.replace(new RegExp(entity, 'g'), char)
  })
  
  // Trim and limit length for summaries
  cleaned = cleaned.trim()
  if (cleaned.length > 300) {
    cleaned = cleaned.substring(0, 300) + '...'
  }
  
  return cleaned
}

/**
 * Legacy function for testing - generates mock articles
 */
export function generateMockArticles(sources: NewsSource[]): Article[] {
  const mockArticles = [
    {
      title: "The Future of Renewable Energy Storage",
      summary: "New breakthrough in battery technology could revolutionize how we store clean energy, making renewable sources more reliable than ever before.",
      source: "Tech News Today"
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement", 
      summary: "World leaders unite on ambitious new targets for carbon reduction, with unprecedented cooperation between major economies.",
      source: "World Report"
    }
  ]

  const availableSources = sources.filter(s => s.isActive)
  const selectedSources = availableSources.length >= 2 
    ? [availableSources[0], availableSources[1]]
    : availableSources

  return mockArticles
    .slice(0, 2)
    .map((article, index) => ({
      id: `mock-${Date.now()}-${index}`,
      title: article.title,
      summary: article.summary,
      url: `https://example.com/article/${Date.now() + index}`,
      source: selectedSources[index % selectedSources.length]?.name || article.source,
      publishedAt: new Date().toISOString(),
      isRead: false
    }))
}

export function getDateKey(): string {
  return new Date().toISOString().split('T')[0]
}