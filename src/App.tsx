import { useEffect, useState } from "react"
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArticleCard } from "@/components/ArticleCard"
import { SourceManager } from "@/components/SourceManager"
import { RefreshCw, Calendar } from "@phosphor-icons/react"
import { Article, NewsSource } from "@/lib/types"
import { generateMockArticles, getDateKey } from "@/lib/articleService"
import { toast, Toaster } from "sonner"

function App() {
  const [sources, setSources] = useKV<NewsSource[]>("news-sources", [])
  const [articles, setArticles] = useKV<Article[]>("daily-articles", [])
  const [lastFetchDate, setLastFetchDate] = useKV<string>("last-fetch-date", "")
  const [isLoading, setIsLoading] = useState(false)

  const todayKey = getDateKey()

  useEffect(() => {
    if (sources.length === 0) {
      const defaultSources: NewsSource[] = [
        {
          id: "1",
          name: "Example Tech News",
          url: "https://example.com/tech/rss",
          isActive: true
        },
        {
          id: "2", 
          name: "Example World News",
          url: "https://example.com/world/rss",
          isActive: true
        },
        {
          id: "3",
          name: "Example Science Daily",
          url: "https://example.com/science/rss", 
          isActive: true
        }
      ]
      setSources(defaultSources)
    }
  }, [sources.length, setSources])

  useEffect(() => {
    if (sources.length > 0 && lastFetchDate !== todayKey) {
      refreshArticles()
    }
  }, [sources, lastFetchDate, todayKey])

  const refreshArticles = async () => {
    if (sources.length === 0) {
      toast.error("Please add news sources first")
      return
    }

    setIsLoading(true)
    try {
      const newArticles = generateMockArticles(sources)
      setArticles(newArticles)
      setLastFetchDate(todayKey)
      toast.success("Articles refreshed successfully")
    } catch (error) {
      toast.error("Failed to fetch articles")
    } finally {
      setIsLoading(false)
    }
  }

  const addSource = (name: string, url: string) => {
    const newSource: NewsSource = {
      id: Date.now().toString(),
      name,
      url,
      isActive: true
    }
    setSources((current) => [...current, newSource])
  }

  const removeSource = (id: string) => {
    setSources((current) => current.filter(source => source.id !== id))
    toast.success("Source removed")
  }

  const toggleSource = (id: string) => {
    setSources((current) => 
      current.map(source => 
        source.id === id ? { ...source, isActive: !source.isActive } : source
      )
    )
  }

  const toggleArticleRead = (articleId: string) => {
    setArticles((current) => 
      current.map(article => 
        article.id === articleId ? { ...article, isRead: !article.isRead } : article
      )
    )
  }

  const activeSources = sources.filter(s => s.isActive)
  const isToday = lastFetchDate === todayKey

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl mb-2 text-primary">
            Daily News Curator
          </h1>
          <p className="text-muted-foreground text-lg">
            Your curated selection of 2 quality articles each day
          </p>
        </header>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <SourceManager
              sources={sources}
              onAddSource={addSource}
              onRemoveSource={removeSource}
              onToggleSource={toggleSource}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={refreshArticles}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Articles
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {isToday ? "Today's selection" : `Last updated: ${lastFetchDate || "Never"}`}
            </span>
          </div>
        </div>

        <Separator className="mb-8" />

        <main>
          {sources.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="font-display text-2xl mb-4">Welcome to Daily News Curator</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by adding news sources. We'll curate 2 quality articles 
                for you each day from your trusted sources.
              </p>
              <SourceManager
                sources={sources}
                onAddSource={addSource}
                onRemoveSource={removeSource}
                onToggleSource={toggleSource}
              />
            </div>
          ) : activeSources.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="font-display text-2xl mb-4">No Active Sources</h2>
              <p className="text-muted-foreground mb-6">
                You have news sources configured, but none are currently active. 
                Activate some sources to start getting articles.
              </p>
              <SourceManager
                sources={sources}
                onAddSource={addSource}
                onRemoveSource={removeSource}
                onToggleSource={toggleSource}
              />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="font-display text-2xl mb-4">Ready to Curate</h2>
              <p className="text-muted-foreground mb-6">
                Your sources are configured. Click refresh to get today's articles.
              </p>
              <Button onClick={refreshArticles} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Get Today's Articles
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-2xl mb-2">
                  {isToday ? "Today's Curated Articles" : "Latest Articles"}
                </h2>
                <p className="text-muted-foreground">
                  {articles.filter(a => a.isRead).length} of {articles.length} articles read
                </p>
              </div>
              
              <div className="grid gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onToggleRead={toggleArticleRead}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Currently showing articles from {activeSources.length} active source{activeSources.length !== 1 ? 's' : ''}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App