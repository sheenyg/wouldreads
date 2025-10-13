import { useEffect, useState } from "react"
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArticleCard } from "@/components/ArticleCard"
import { SourceManager } from "@/components/SourceManager"
import { Garden } from "@/components/Garden"
import { ArrowsClockwise, Calendar, Newspaper, Plant } from "@phosphor-icons/react"
import { Article, NewsSource, Plot, PlantType } from "@/lib/types"
import { fetchArticlesFromSources, generateMockArticles, getDateKey } from "@/lib/articleService"
import { toast, Toaster } from "sonner"

function App() {
  const [sources, setSources] = useKV<NewsSource[]>("news-sources", [])
  const [articles, setArticles] = useKV<Article[]>("daily-articles", [])
  const [lastFetchDate, setLastFetchDate] = useKV<string>("last-fetch-date", "")
  const [isLoading, setIsLoading] = useState(false)
  const [useRealFeeds, setUseRealFeeds] = useKV<boolean>("use-real-feeds", true)
  const [activeTab, setActiveTab] = useState<'news' | 'garden'>('news')
  const [plots, setPlots] = useKV<Plot[]>("garden-plots", [])

  const todayKey = getDateKey()

  // Initialize garden plots
  useEffect(() => {
    if (plots.length === 0) {
      const initialPlots: Plot[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        plantType: null,
        plantedAt: null,
        isGrown: false
      }))
      setPlots(initialPlots)
    }
  }, [plots.length, setPlots])

  useEffect(() => {
    if (sources.length === 0) {
      const defaultSources: NewsSource[] = [
        {
          id: "1",
          name: "The New Yorker",
          url: "https://www.newyorker.com/feed/rss",
          isActive: true
        },
        {
          id: "2", 
          name: "Stratechery",
          url: "https://stratechery.com/feed/",
          isActive: true
        },
        {
          id: "3",
          name: "Sherwood News",
          url: "https://sherwood.news/feed/",
          isActive: true
        },
        {
          id: "4",
          name: "The New York Times",
          url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
          isActive: true
        },
        {
          id: "5",
          name: "Hacker News",
          url: "https://hnrss.org/frontpage",
          isActive: true
        },
        {
          id: "6",
          name: "Semafor",
          url: "https://www.semafor.com/feed",
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

    const activeSources = sources.filter(s => s.isActive)
    if (activeSources.length === 0) {
      toast.error("Please activate at least one news source")
      return
    }

    setIsLoading(true)
    try {
      let newArticles: Article[]
      
      if (useRealFeeds) {
        toast.info(`Fetching articles from ${activeSources.length} RSS feeds...`)
        newArticles = await fetchArticlesFromSources(sources)
        
        // Count articles per source to provide feedback
        const sourceNames = activeSources.map(s => s.name)
        const sourcesWithArticles = [...new Set(newArticles.map(a => a.source))]
        const failedSources = sourceNames.filter(name => !sourcesWithArticles.includes(name))
        
        if (failedSources.length > 0) {
          toast.warning(`Successfully fetched ${newArticles.length} articles. Failed sources: ${failedSources.join(', ')}`)
        } else {
          toast.success(`Fetched ${newArticles.length} articles from all ${sourcesWithArticles.length} sources`)
        }
      } else {
        newArticles = generateMockArticles(sources)
        toast.success("Generated mock articles")
      }
      
      setArticles(newArticles)
      setLastFetchDate(todayKey)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      
      if (useRealFeeds) {
        toast.error("Failed to fetch from RSS feeds. Using mock articles as fallback.")
        // Fallback to mock articles if RSS fails
        const mockArticles = generateMockArticles(sources)
        setArticles(mockArticles)
        setLastFetchDate(todayKey)
      } else {
        toast.error("Failed to generate articles")
      }
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

  const activateAllSources = () => {
    setSources((current) => 
      current.map(source => ({ ...source, isActive: true }))
    )
    toast.success("All sources activated")
  }

  const handlePlantSeed = (plotId: number, plantType: PlantType) => {
    const plantedTime = new Date().toISOString()
    // Plants grow after 5 minutes (300000ms) - for demo purposes
    // In production, this could be hours or days
    const growthTimeMs = 5 * 60 * 1000
    const currentTime = Date.now()
    const isGrown = false // Seeds start as not grown
    
    setPlots((current) =>
      current.map((plot) =>
        plot.id === plotId
          ? {
              ...plot,
              plantType,
              plantedAt: plantedTime,
              isGrown
            }
          : plot
      )
    )
    
    // Check growth after the specified time
    setTimeout(() => {
      setPlots((current) =>
        current.map((plot) =>
          plot.id === plotId && plot.plantedAt === plantedTime
            ? { ...plot, isGrown: true }
            : plot
        )
      )
    }, growthTimeMs)
  }

  const handleHarvestPlot = (plotId: number) => {
    setPlots((current) =>
      current.map((plot) =>
        plot.id === plotId
          ? {
              ...plot,
              plantType: null,
              plantedAt: null,
              isGrown: false
            }
          : plot
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
            wouldreads
          </h1>
          <p className="text-muted-foreground text-lg">
            Automatic article recommendations from my favorite tech + culture news sources
          </p>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant={activeTab === 'news' ? 'default' : 'outline'}
              onClick={() => setActiveTab('news')}
              className="gap-2"
            >
              <Newspaper className="w-4 h-4" />
              News Feed
            </Button>
            <Button
              variant={activeTab === 'garden' ? 'default' : 'outline'}
              onClick={() => setActiveTab('garden')}
              className="gap-2"
            >
              <Plant className="w-4 h-4" />
              Garden
            </Button>
          </div>
        </header>

        <div className="space-y-6">
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
                  <ArrowsClockwise className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Articles
                </Button>

                {sources.some(s => !s.isActive) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={activateAllSources}
                  >
                    Activate All Sources
                  </Button>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="feed-mode"
                    checked={useRealFeeds}
                    onCheckedChange={setUseRealFeeds}
                  />
                  <Label htmlFor="feed-mode" className="text-sm">
                    {useRealFeeds ? "Live RSS" : "Mock Data"}
                  </Label>
                </div>
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
              {activeTab === 'garden' ? (
                <Garden
                  plots={plots}
                  onPlantSeed={handlePlantSeed}
                  onHarvestPlot={handleHarvestPlot}
                />
              ) : sources.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="font-display text-2xl mb-4">Welcome to wouldreads</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Get started by adding news sources. We'll curate 50 quality articles 
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
                    <ArrowsClockwise className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
                      {articles.filter(a => a.isRead).length} of {articles.length} articles read • Showing articles from all active sources
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
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Currently showing articles from {activeSources.length} active source{activeSources.length !== 1 ? 's' : ''}
            {useRealFeeds ? " • Live RSS feeds" : " • Mock data mode"}
          </p>
          {useRealFeeds && (
            <p className="mt-2 text-xs">
              RSS feeds are fetched via proxy service to handle CORS restrictions
            </p>
          )}
          <p className="mt-4 text-xs">
            Made with love by Sheena Ganju and GitHub Spark
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App