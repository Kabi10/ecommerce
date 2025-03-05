"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@/types"

interface BulkUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "category" | "price" | "stock"
  onUpdate: (value: string | number) => Promise<void>
  categories?: Category[]
  selectedCount: number
}

export function BulkUpdateDialog({
  open,
  onOpenChange,
  type,
  onUpdate,
  categories,
  selectedCount,
}: BulkUpdateDialogProps) {
  const [value, setValue] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      const parsedValue = type === "category" ? value : Number(value)
      await onUpdate(parsedValue)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bulk Update {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Update {type} for {selectedCount} selected products
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {type === "category" && categories ? (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={value}
                onValueChange={setValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === "price" && " ($)"}
              </Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter new ${type}`}
                min={0}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!value || isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 