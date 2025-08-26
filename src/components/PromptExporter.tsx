import { useState, useEffect } from "react"
import { useKV } from '@github/spark/hooks'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Download, Copy, FileText } from "@phosphor-icons/react"
import { toast } from "sonner"

interface PromptHistory {
  id: string
  timestamp: string
  prompt: string
  context?: string
}

export function PromptExporter() {
  const [promptHistory, setPromptHistory] = useKV<PromptHistory[]>("prompt-history", [])
  const [exportText, setExportText] = useState("")

  useEffect(() => {
    // Generate export text from stored history
    if (promptHistory.length > 0) {
      const formatted = promptHistory.map((entry, index) => {
        return `## Prompt ${index + 1} - ${new Date(entry.timestamp).toLocaleString()}

${entry.prompt}

${entry.context ? `**Context:** ${entry.context}` : ''}

---`
      }).join('\n\n')

      setExportText(`# Prompt History Export

Generated on: ${new Date().toLocaleString()}
Total prompts: ${promptHistory.length}

${formatted}`)
    } else {
      setExportText(`# Prompt History Export

Generated on: ${new Date().toLocaleString()}
Total prompts: 0

No prompt history found. This could mean:
- This is a fresh session
- Prompt tracking was not enabled in previous sessions
- The prompt history was cleared

Note: This app (wouldreads) appears to be a news aggregation tool that fetches articles from RSS feeds. Based on the current codebase, previous development prompts might have included:
- Initial setup and design requests
- RSS feed integration
- Article curation features
- UI/UX improvements
- Source management functionality`)
    }
  }, [promptHistory])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText)
      toast.success("Prompt history copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadAsFile = () => {
    const blob = new Blob([exportText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-history-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Prompt history downloaded")
  }

  const addCurrentPrompt = () => {
    const newPrompt: PromptHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prompt: "I want to summarize all of the prompts I've given you for export",
      context: "User requested export of conversation history"
    }
    
    setPromptHistory((current) => [...current, newPrompt])
    toast.success("Current prompt added to history")
  }

  const clearHistory = () => {
    setPromptHistory([])
    toast.success("Prompt history cleared")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <CardTitle>Prompt History Export</CardTitle>
        </div>
        <CardDescription>
          Export your conversation history and prompts given to the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={downloadAsFile} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download as File
          </Button>
          <Button onClick={addCurrentPrompt} variant="outline" size="sm">
            Add Current Prompt
          </Button>
          <Button onClick={clearHistory} variant="destructive" size="sm">
            Clear History
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Export Preview ({promptHistory.length} prompts stored)
          </label>
          <Textarea
            value={exportText}
            readOnly
            className="min-h-[400px] font-mono text-sm"
            placeholder="Your prompt history will appear here..."
          />
        </div>

        {promptHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">No prompt history found in storage.</p>
            <p className="text-sm">
              This could be because this is a fresh session or prompt tracking wasn't enabled previously.
              You can add the current prompt to start building a history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}