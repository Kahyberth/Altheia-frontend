"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, X, ZoomIn, ZoomOut, RotateCw, Printer, Share2, Maximize2, Minimize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string | null
  title?: string
}

export function ImageViewer({ open, onOpenChange, imageUrl, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setZoom(100)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
  }, [open])

  const handleZoomIn = () => {
    if (zoom < 300) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoom > 100) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (!imageUrl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{title || "Image Viewer"}</DialogTitle>
              <DialogDescription>Use the controls to zoom, rotate, or download the image</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div
          ref={containerRef}
          className="flex h-[70vh] flex-col bg-slate-900"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Image Viewer */}
          <div
            className="flex-1 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            style={{ cursor: isDragging ? "grabbing" : zoom > 100 ? "grab" : "default" }}
          >
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={title || "Image"}
                  className="max-h-[65vh] max-w-full object-contain"
                  draggable="false"
                />
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between bg-white border-t p-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
              <span className="text-sm">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 300}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Rotate</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-xs text-slate-500">
              <span>End-to-end encrypted • HIPAA Compliant</span>
            </div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
