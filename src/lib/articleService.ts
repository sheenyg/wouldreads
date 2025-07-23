import { Article, NewsSource } from './types'

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Fetches and parses RSS feeds from news sources to get real articles
 * Uses CORS proxy to handle cross-origin requests to RSS feeds
 */
export async function fetchArticlesFromSources(sources: NewsSource[]): Promise<Article[]> {
  const activeSources = sources.filter(s => s.isActive)
  
  if (activeSources.length === 0) {
    throw new Error('No active sources configured')
  }

  const articlesBySource: { [sourceId: string]: Article[] } = {}
  
  // Fetch articles from each source
  for (const source of activeSources) {
    try {
      const articles = await fetchArticlesFromRSS(source)
      articlesBySource[source.id] = articles
    } catch (error) {
      console.warn(`Failed to fetch from ${source.name}:`, error)
      // Continue with other sources even if one fails
    }
  }

  if (Object.keys(articlesBySource).length === 0) {
    throw new Error('Failed to fetch articles from any source')
  }

  // Ensure at least one article from each successful source
  const guaranteedArticles: Article[] = []
  const remainingArticles: Article[] = []
  
  for (const [sourceId, articles] of Object.entries(articlesBySource)) {
    if (articles.length > 0) {
      // Take the first (most recent) article from each source
      guaranteedArticles.push(articles[0])
      // Add the rest to the pool
      remainingArticles.push(...articles.slice(1))
    }
  }

  // Shuffle remaining articles to ensure randomness
  const shuffledRemaining = shuffleArray([...remainingArticles])
  
  // Combine guaranteed articles with shuffled remaining articles
  const allArticles = [...guaranteedArticles, ...shuffledRemaining]
  
  // Shuffle the entire list to randomize order while maintaining source representation
  const finalArticles = shuffleArray(allArticles)
  
  // Return up to 50 articles
  return finalArticles.slice(0, 50)
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

    return articles.slice(0, 15) // Take more articles from each source for better variety
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
  const mockTitles = [
    "The Future of Renewable Energy Storage",
    "Global Climate Summit Reaches Historic Agreement", 
    "AI Breakthrough in Medical Diagnosis",
    "Space Technology Advances Mars Mission Timeline",
    "Economic Markets Show Resilience in Q4",
    "Education Reform Initiatives Gain Momentum",
    "Cybersecurity Threats Evolve with New Technologies",
    "Urban Planning Solutions for Smart Cities",
    "Healthcare Innovation Reduces Treatment Costs",
    "Transportation Revolution Through Electric Vehicles",
    "Agricultural Technology Improves Crop Yields",
    "Financial Technology Transforms Banking",
    "Entertainment Industry Embraces Virtual Reality",
    "Environmental Conservation Efforts Show Progress",
    "Scientific Research Unlocks New Possibilities",
    "Social Media Platforms Enhance User Safety",
    "Manufacturing Efficiency Through Automation",
    "Digital Privacy Laws Strengthen Protections",
    "Renewable Materials Replace Traditional Plastics",
    "Communication Networks Expand Global Reach",
    "Food Security Solutions Address Growing Demand",
    "Mental Health Resources Become More Accessible",
    "Cultural Preservation Through Digital Archives",
    "Sports Technology Enhances Athletic Performance",
    "Housing Innovation Addresses Urban Challenges",
    "Disaster Preparedness Systems Save Lives",
    "Ocean Cleanup Initiatives Show Promise",
    "Biodiversity Conservation Efforts Expand",
    "Clean Water Technology Serves Remote Communities",
    "Pharmaceutical Research Accelerates Drug Discovery",
    "Remote Work Solutions Transform Business",
    "Educational Technology Improves Learning Outcomes",
    "Sustainable Fashion Industry Reduces Waste",
    "Public Transportation Systems Go Electric",
    "Community Gardens Strengthen Local Food Systems",
    "Senior Care Technology Improves Quality of Life",
    "Youth Programs Foster Innovation and Leadership",
    "Cultural Exchange Programs Build Understanding",
    "Wildlife Protection Efforts Show Success",
    "Economic Development Supports Small Businesses",
    "Infrastructure Investment Creates Jobs",
    "Tourism Industry Adopts Sustainable Practices",
    "Archaeological Discoveries Reveal New History",
    "Art and Technology Collaboration Creates New Forms",
    "Language Preservation Efforts Use Digital Tools",
    "Community Safety Programs Reduce Crime",
    "Alternative Energy Sources Power Rural Areas",
    "Scientific Education Programs Inspire Next Generation",
    "International Cooperation Addresses Global Challenges",
    "Innovation Hubs Foster Entrepreneurship"
  ]

  const availableSources = sources.filter(s => s.isActive)
  
  if (availableSources.length === 0) {
    return []
  }

  const articles: Article[] = []
  
  // Ensure at least one article from each source
  availableSources.forEach((source, index) => {
    articles.push({
      id: `mock-${Date.now()}-${index}`,
      title: mockTitles[index % mockTitles.length],
      summary: `This is a detailed summary for the article "${mockTitles[index % mockTitles.length]}" providing insights and analysis on current developments in this important topic.`,
      url: `https://example.com/article/${Date.now() + index}`,
      source: source.name,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false
    })
  })
  
  // Fill remaining slots up to 50 articles
  const remainingSlots = Math.max(0, 50 - articles.length)
  for (let i = 0; i < remainingSlots; i++) {
    const titleIndex = (availableSources.length + i) % mockTitles.length
    const sourceIndex = i % availableSources.length
    
    articles.push({
      id: `mock-${Date.now()}-${availableSources.length + i}`,
      title: mockTitles[titleIndex],
      summary: `This is a detailed summary for the article "${mockTitles[titleIndex]}" providing insights and analysis on current developments in this important topic.`,
      url: `https://example.com/article/${Date.now() + availableSources.length + i}`,
      source: availableSources[sourceIndex].name,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false
    })
  }

  // Shuffle the articles for random order
  return shuffleArray(articles)
}

export function getDateKey(): string {
  return new Date().toISOString().split('T')[0]
}