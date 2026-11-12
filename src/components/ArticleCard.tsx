import { useEffect, useId, useRef, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowSquareOut, Check, ArrowCounterClockwise, Star } from "@phosphor-icons/react"
import { Article } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
  onToggleRead: (id: string) => void
  onToggleStar?: (id: string) => void
}

export function ArticleCard({ article, onToggleRead, onToggleStar }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const summaryRef = useRef<HTMLParagraphElement>(null)
  const summaryId = useId()

  useEffect(() => {
    const summary = summaryRef.current
    if (!summary || isExpanded) return

    let active = true
    const measureSummary = () => {
      if (active) setIsTruncated(summary.scrollHeight > summary.clientHeight)
    }
    const observer = new ResizeObserver(measureSummary)
    observer.observe(summary)
    measureSummary()
    void document.fonts.ready.then(measureSummary)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [article.summary, isExpanded])

  const handleCardClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking buttons
  }

  return (
    <Card 
      className={cn(
        "relative gap-2 rounded-[8px] py-4 shadow-none transition-colors duration-200 cursor-pointer overflow-hidden hover:border-primary/40",
        article.isRead ? "border-muted" : "border-primary/20"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="px-4 pb-0">
        <div className="min-w-0">
          {onToggleStar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                handleButtonClick(e)
                onToggleStar(article.id)
              }}
              className="absolute right-1.5 top-1.5 h-11 w-11 p-0 text-muted-foreground hover:bg-secondary hover:text-primary"
              aria-label={article.isStarred ? "Unstar article" : "Star article"}
              aria-pressed={article.isStarred}
            >
              <Star 
                className={cn("size-5", article.isStarred && "text-primary")}
                weight={article.isStarred ? "fill" : "regular"}
              />
            </Button>
          )}
          <h2 className={cn(
            "font-display font-semibold text-xl leading-6 mb-1.5 break-words",
            onToggleStar && "pr-10",
            article.isRead && "text-muted-foreground"
          )}>
            {article.title}
          </h2>
          <div className="flex items-center gap-x-1 flex-wrap text-xs leading-[18px] text-muted-foreground">
            <span className="break-words min-w-0">{article.source}</span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <p ref={summaryRef} id={summaryId} className={cn(
          "font-display text-base leading-[21px] mb-2 break-words",
          !isExpanded && "line-clamp-2",
          article.isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {article.summary}
        </p>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              handleButtonClick(e)
              onToggleRead(article.id)
            }}
            className="h-11 sm:h-8 px-0 has-[>svg]:px-0 text-[13px]"
          >
            {article.isRead ? (
              <>
                <ArrowCounterClockwise className="size-4" />
                Mark unread
              </>
            ) : (
              <>
                <Check className="size-4" />
                Mark read
              </>
            )}
          </Button>
          <Button
            variant="link"
            size="sm"
            asChild
            className="h-11 sm:h-8 px-0 has-[>svg]:px-0 text-[13px]"
            onClick={(e) => {
              handleButtonClick(e)
              if (!article.isRead) onToggleRead(article.id)
            }}
          >
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              Read article
              <ArrowSquareOut className="size-4" />
            </a>
          </Button>
          {isTruncated && (
            <Button
              variant="link"
              size="sm"
              className="ml-auto h-11 sm:h-8 px-0 text-xs text-muted-foreground"
              aria-expanded={isExpanded}
              aria-controls={summaryId}
              aria-label={isExpanded ? "Show less summary" : "Show full summary"}
              onClick={(e) => {
                handleButtonClick(e)
                setIsExpanded((expanded) => !expanded)
              }}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
