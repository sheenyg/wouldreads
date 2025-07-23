import { Article, NewsSource } from './types'

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
    },
    {
      title: "AI Breakthrough in Medical Diagnosis",
      summary: "Machine learning system shows 95% accuracy in early cancer detection, potentially saving thousands of lives through early intervention.",
      source: "Medical Journal"
    },
    {
      title: "Space Exploration Milestone Achieved",
      summary: "Private space company successfully demonstrates new propulsion technology that could cut Mars travel time in half.",
      source: "Space Today"
    },
    {
      title: "Sustainable Agriculture Innovation",
      summary: "Vertical farming techniques show promising results in urban environments, producing 30% more yield with 70% less water usage.",
      source: "Agricultural Review"
    },
    {
      title: "Digital Privacy Legislation Update",
      summary: "New international framework for data protection aims to balance innovation with user privacy rights across borders.",
      source: "Policy Digest"
    }
  ]

  const availableSources = sources.filter(s => s.isActive)
  const selectedSources = availableSources.length >= 2 
    ? [availableSources[0], availableSources[1]]
    : availableSources

  return mockArticles
    .slice(0, 2)
    .map((article, index) => ({
      id: Date.now() + index,
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