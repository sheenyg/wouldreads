import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowSquareOut, Check, ArrowCounterClockwise, Star } from "@phosphor-icons/react"
import { Article } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
  onToggleRead: (id: string) => void
  onToggleStar?: (id: string) => void
}

export function ArticleCard({ article, onToggleRead }: ArticleCardProps) {
  const handleCardClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking buttons
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover: shadow-lg border-2 cursor-pointer",
        article. isRead ?  "opacity-75 border-muted" : "border-primary/20 hover:border-primary/40"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className={cn(
              "font-display font-semibold text-xl leading-tight mb-2",
              article.isRead && "text-muted-foreground"
            )}>
              {article.title}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {article. source}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(article. publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button
            variant={article.isRead ? "outline" : "default"}
            size="sm"
            onClick={(e) => {
              handleButtonClick(e)
              onToggleRead(article.id)
            }}
            className="shrink-0"
          >
            {article.isRead ? (
              <>
                <ArrowCounterClockwise className="w-4 h-4 mr-1" />
                Mark Unread
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" />
                Mark Read
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm leading-relaxed mb-4",
          article.isRead ?  "text-muted-foreground" : "text-foreground"
        )}>
          {article.summary}
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hover:bg-accent hover:text-accent-foreground"
          onClick={(e) => {
            handleButtonClick(e)
            if (! article.isRead) onToggleRead(article.id)
          }}
        >
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <ArrowSquareOut className="w-4 h-4 mr-2" />
            Read Full Article
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}