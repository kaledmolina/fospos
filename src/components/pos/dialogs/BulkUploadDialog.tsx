"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  bulkUploadData: string
  onBulkUploadDataChange: (data: string) => void
  onBulkUpload: () => void
}

export const BulkUploadDialog = ({
  open,
  onOpenChange,
  onFileUpload,
  fileInputRef,
  bulkUploadData,
  onBulkUploadDataChange,
  onBulkUpload
}: BulkUploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Productos</DialogTitle>
          <DialogDescription>Sube un archivo JSON con los productos o pega el contenido directamente.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Subir archivo</Label>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={onFileUpload} />
            <Button variant="outline" className="w-full cursor-pointer transition-all duration-200 hover:scale-[1.01]" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />Seleccionar archivo JSON
            </Button>
          </div>
          <div className="space-y-2">
            <Label>O pega el JSON aquí</Label>
            <div className="bg-gray-50 p-4 rounded-lg text-sm mb-2">
              <p className="font-medium mb-1">Formato esperado:</p>
              <code className="text-xs text-muted-foreground block whitespace-pre overflow-x-auto">
{`[
  {
    "name": "Producto 1",
    "code": "P001",
    "costPrice": 1000,
    "salePrice": 1500,
    "stock": 50,
    "minStock": 5,
    "unit": "unidad"
  }
]`}
              </code>
            </div>
            <Textarea 
              value={bulkUploadData} 
              onChange={e => onBulkUploadDataChange(e.target.value)} 
              placeholder="Pega el array JSON aquí..."
              className="font-mono text-sm h-48"
            />
          </div>
          <Button 
            className="w-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition-all duration-200" 
            onClick={onBulkUpload} 
            disabled={!bulkUploadData}
          >
            <Upload className="w-4 h-4 mr-2" />Cargar Productos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
