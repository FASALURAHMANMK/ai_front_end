"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MultiStepDialogProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  children: React.ReactNode
  steps: string[]
  className?: string
}

export function MultiStepDialog({
  title,
  description,
  isOpen,
  onClose,
  onComplete,
  children,
  steps,
  className,
}: MultiStepDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const childrenArray = React.Children.toArray(children)

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    onClose()
  }

  const handleComplete = () => {
    onComplete()
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("max-w-2xl", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="relative mb-6">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    index <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-gray-300 bg-background text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    index <= currentStep ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[200px]">{childrenArray[currentStep]}</div>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={prev}>
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 ? (
              <Button onClick={next}>Next</Button>
            ) : (
              <Button onClick={handleComplete}>Complete</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

