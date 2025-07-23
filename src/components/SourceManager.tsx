import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Settings } from "@phosphor-icons/react"
import { NewsSource } from "@/lib/types"
import { toast } from "sonner"

interface SourceManagerProps {
  sources: NewsSource[]
  onAddSource: (name: string, url: string) => void
  onRemoveSource: (id: string) => void
  onToggleSource: (id: string) => void
}

export function SourceManager({ sources, onAddSource, onRemoveSource, onToggleSource }: SourceManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceUrl, setNewSourceUrl] = useState("")

  const handleAddSource = () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      toast.error("Please provide both name and URL")
      return
    }

    try {
      new URL(newSourceUrl)
    } catch {
      toast.error("Please provide a valid URL")
      return
    }

    onAddSource(newSourceName.trim(), newSourceUrl.trim())
    setNewSourceName("")
    setNewSourceUrl("")
    toast.success("Source added successfully")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage Sources
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">News Sources</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Add New Source</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="source-name">Source Name</Label>
                <Input
                  id="source-name"
                  placeholder="e.g., BBC News"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="source-url">RSS/News URL</Label>
                <Input
                  id="source-url"
                  placeholder="e.g., https://feeds.bbci.co.uk/news/rss.xml"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAddSource} className="w-fit">
                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Current Sources ({sources.length})</h3>
            {sources.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No sources configured. Add some sources to start curating articles.
              </p>
            ) : (
              <div className="grid gap-3">
                {sources.map((source) => (
                  <Card key={source.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {source.name}
                          <Badge variant={source.isActive ? "default" : "secondary"}>
                            {source.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleSource(source.id)}
                          >
                            {source.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSource(source.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground break-all">
                        {source.url}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}