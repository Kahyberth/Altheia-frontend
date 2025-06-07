"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DocumentViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
  patientName?: string
}

export function DocumentViewer({ open, onOpenChange, document, patientName }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    if (zoom < 200) {
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{document.name}</DialogTitle>
              <DialogDescription>
                {patientName && `${patientName} • `}
                {new Date(document.uploadedAt).toLocaleDateString()} • {document.size}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[70vh] flex-col">
          {/* Document Viewer */}
          <div className="flex-1 overflow-auto bg-slate-100 p-4">
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
                className="bg-white shadow-lg"
              >
                {/* This would be replaced with an actual document viewer component */}
                <div className="flex h-[800px] w-[600px] flex-col items-center justify-center border p-8 text-center">
                  <div className="mb-4 rounded-full bg-slate-100 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">{document.name}</h3>
                  <p className="mt-2 text-slate-500">
                    This is a preview of the document. In a real implementation, the actual document would be displayed
                    here.
                  </p>
                  <div className="mt-8 space-y-4 text-left">
                    <p className="font-medium">Document Information:</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Type:</span> {document.type.toUpperCase()}
                      </p>
                      <p>
                        <span className="font-medium">Size:</span> {document.size}
                      </p>
                      <p>
                        <span className="font-medium">Uploaded by:</span> {document.uploadedBy}
                      </p>
                      <p>
                        <span className="font-medium">Upload date:</span>{" "}
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-t p-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
              <span className="text-sm">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Rotate</span>
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
