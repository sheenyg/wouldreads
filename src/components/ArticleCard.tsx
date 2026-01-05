import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowSquareOut, Check, ArrowCounterClockwise, Star, StarFill } from "@phosphor-icons/react"
import { Article } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
  onToggleRead: (id: string) => void
  onToggleStar?: (id: string) => void
}

export function ArticleCard({ article, onToggleRead, onToggleStar }: ArticleCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg border-2",
      article.isRead ? "opacity-75 border-muted" : "border-primary/20 hover:border-primary/40"
    )}>
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
                {article.source}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onToggleStar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStar(article.id)}
                className="hover:bg-yellow-50 hover:text-yellow-600"
              >
                {article.isStarred ? (
                  <StarFill className="w-5 h-5 text-yellow-500" weight="fill" />
                ) : (
                  <Star className="w-5 h-5" />
                )}
              </Button>
            )}
            <Button
              variant={article.isRead ? "outline" : "default"}
              size="sm"
              onClick={() => onToggleRead(article.id)}
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
        </div>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm leading-relaxed mb-4",
          article.isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {article.summary}
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hover:bg-accent hover:text-accent-foreground"
          onClick={() => !article.isRead && onToggleRead(article.id)}
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