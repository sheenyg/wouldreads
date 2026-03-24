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

export function ArticleCard({ article, onToggleRead, onToggleStar }: ArticleCardProps) {
  const handleCardClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking buttons
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-2 cursor-pointer overflow-hidden",
        article.isRead ? "opacity-75 border-muted" : "border-primary/20 hover:border-primary/40"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="min-w-0">
          {onToggleStar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                handleButtonClick(e)
                onToggleStar(article.id)
              }}
              className="mb-2 -ml-2 h-10 w-10 p-0 hover:bg-accent"
              aria-label={article.isStarred ? "Unstar article" : "Star article"}
            >
              <Star 
                className="w-5 h-5" 
                weight={article.isStarred ? "fill" : "regular"}
                color={article.isStarred ? undefined : "#d1d5db"}
              />
            </Button>
          )}
          <h2 className={cn(
            "font-display font-semibold text-lg sm:text-xl leading-tight mb-2 break-words",
            article.isRead && "text-muted-foreground"
          )}>
            {article.title}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {article.source}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm leading-relaxed mb-4 break-words",
          article.isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {article.summary}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={article.isRead ? "outline" : "default"}
            size="sm"
            onClick={(e) => {
              handleButtonClick(e)
              onToggleRead(article.id)
            }}
            className="w-full sm:w-auto"
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
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              handleButtonClick(e)
              if (!article.isRead) onToggleRead(article.id)
            }}
          >
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center no-underline bg-gradient-to-r from-foreground to-foreground bg-[length:0_1px] bg-no-repeat bg-left-bottom hover:bg-[length:100%_1px] transition-[background-size,opacity] opacity-90 hover:opacity-100"
            >
              <ArrowSquareOut className="w-4 h-4 mr-2" />
              Read Full Article
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
