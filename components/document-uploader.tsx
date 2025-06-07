"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText, FileImage, File, AlertTriangle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface DocumentUploaderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string | null
}

export function DocumentUploader({ open, onOpenChange, patientId }: DocumentUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [documentType, setDocumentType] = useState("")
  const [description, setDescription] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...fileArray])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files)
      setFiles((prevFiles) => [...prevFiles, ...fileArray])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload")
      return
    }

    if (!documentType) {
      setUploadError("Please select a document type")
      return
    }

    setUploadError(null)
    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUploadComplete(true)
      }
    }, 200)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state when dialog is closed
    setTimeout(() => {
      setFiles([])
      setDocumentType("")
      setDescription("")
      setUploadProgress(0)
      setIsUploading(false)
      setUploadComplete(false)
      setUploadError(null)
    }, 300)
  }

  const getFileIcon = (file: File) => {
    const fileType = file.type.split("/")[0]
    switch (fileType) {
      case "image":
        return <FileImage className="h-5 w-5 text-blue-500" />
      case "application":
        if (file.type.includes("pdf")) {
          return <FileText className="h-5 w-5 text-red-500" />
        }
        return <File className="h-5 w-5 text-amber-500" />
      default:
        return <File className="h-5 w-5 text-slate-500" />
    }
  }

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {!uploadComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Upload Medical Documents</DialogTitle>
              <DialogDescription>
                Upload documents to the patient's medical record. Supported formats: PDF, JPG, PNG, DICOM.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab_result">Lab Result</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="clinical_note">Clinical Note</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                    <SelectItem value="consent_form">Consent Form</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for these documents"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Files *</Label>
                <div
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    files.length > 0 ? "border-blue-300 bg-blue-50" : "border-slate-300 hover:border-blue-300"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center text-center">
                    <Upload className="mb-2 h-10 w-10 text-slate-400" />
                    <p className="mb-1 font-medium">Drag and drop files here</p>
                    <p className="mb-4 text-sm text-slate-500">or click to browse</p>
                    <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                      Select Files
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    />
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="max-h-40 overflow-auto rounded-lg border p-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-slate-500">{getFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-slate-600"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{uploadError}</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Uploading...</Label>
                    <span className="text-sm text-slate-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Upload Complete</h2>
            <p className="mb-6 text-slate-500">
              {files.length} {files.length === 1 ? "file has" : "files have"} been successfully uploaded to the
              patient's medical record.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setFiles([])
                  setDocumentType("")
                  setDescription("")
                  setUploadProgress(0)
                  setUploadComplete(false)
                }}
              >
                Upload More
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
