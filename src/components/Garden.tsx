import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plant, Leaf, Carrot } from "@phosphor-icons/react"
import { PlantType, Plot } from "@/lib/types"
import { toast } from "sonner"

interface GardenProps {
  plots: Plot[]
  onPlantSeed: (plotId: number, plantType: PlantType) => void
  onHarvestPlot: (plotId: number) => void
}

const plantInfo = {
  tomato: {
    name: 'Tomato',
    icon: Plant,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    emoji: '🍅'
  },
  carrot: {
    name: 'Carrot',
    icon: Carrot,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    emoji: '🥕'
  },
  lettuce: {
    name: 'Lettuce',
    icon: Leaf,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    emoji: '🥬'
  }
}

export function Garden({ plots, onPlantSeed, onHarvestPlot }: GardenProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantType>(null)

  const handlePlotClick = (plot: Plot) => {
    if (plot.plantType === null && selectedPlant) {
      onPlantSeed(plot.id, selectedPlant)
      toast.success(`Planted ${plantInfo[selectedPlant].name}!`)
    } else if (plot.plantType && plot.isGrown) {
      onHarvestPlot(plot.id)
      toast.success(`Harvested ${plantInfo[plot.plantType].name}!`)
    } else if (plot.plantType && !plot.isGrown) {
      toast.info(`${plantInfo[plot.plantType].name} is still growing...`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plant className="w-6 h-6" />
            Select Plant Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(plantInfo) as Array<keyof typeof plantInfo>).map((type) => {
              const info = plantInfo[type]
              const Icon = info.icon
              return (
                <Button
                  key={type}
                  variant={selectedPlant === type ? "default" : "outline"}
                  className={`h-24 flex flex-col gap-2 ${selectedPlant === type ? info.color : ''}`}
                  onClick={() => setSelectedPlant(type)}
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-lg">{info.emoji}</span>
                  <span>{info.name}</span>
                </Button>
              )
            })}
          </div>
          {selectedPlant && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Click on an empty plot to plant {plantInfo[selectedPlant].name}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            Garden Plot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {plots.map((plot) => {
              const plantType = plot.plantType
              const info = plantType ? plantInfo[plantType] : null
              const Icon = info?.icon

              return (
                <button
                  key={plot.id}
                  onClick={() => handlePlotClick(plot)}
                  className={`
                    relative aspect-square rounded-lg border-2 transition-all
                    hover:shadow-lg hover:scale-105 active:scale-95
                    ${plot.plantType === null 
                      ? 'border-dashed border-gray-300 bg-gray-50 hover:border-gray-400' 
                      : `${info?.bgColor} border-solid ${info?.color}`
                    }
                  `}
                >
                  {plantType === null ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                      <div className="text-3xl">🌱</div>
                      <span className="text-xs">Empty</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      {Icon && <Icon className={`w-8 h-8 ${info?.color || ''}`} />}
                      <span className="text-2xl">{plot.isGrown ? info?.emoji : '🌱'}</span>
                      <span className="text-xs font-medium">
                        {plot.isGrown ? 'Ready!' : 'Growing'}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground">
            <span>🌱 Empty: {plots.filter(p => p.plantType === null).length}</span>
            <span>🌿 Growing: {plots.filter(p => p.plantType && !p.isGrown).length}</span>
            <span>✨ Ready: {plots.filter(p => p.isGrown).length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
