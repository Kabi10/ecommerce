"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Plus, Minus, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock: number
  lowStockThreshold: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  variant?: string
}

interface InventoryManagementProps {
  items: InventoryItem[]
  onSave: (items: InventoryItem[]) => Promise<void>
  onStockAdjust?: (id: string, adjustment: number, reason: string) => Promise<void>
}

export function InventoryManagement({
  items: initialItems,
  onSave,
  onStockAdjust,
}: InventoryManagementProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [adjustmentItem, setAdjustmentItem] = useState<string | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0)
  const [adjustmentReason, setAdjustmentReason] = useState<string>("restock")
  const { toast } = useToast()

  // Update stock level
  const updateStock = (id: string, stock: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, stock)
          let status: InventoryItem["status"] = "in-stock"
          
          if (newStock === 0) {
            status = "out-of-stock"
          } else if (newStock <= item.lowStockThreshold) {
            status = "low-stock"
          }
          
          return {
            ...item,
            stock: newStock,
            status,
          }
        }
        return item
      })
    )
  }

  // Update low stock threshold
  const updateLowStockThreshold = (id: string, threshold: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newThreshold = Math.max(0, threshold)
          let status = item.status
          
          // Update status based on new threshold
          if (item.stock === 0) {
            status = "out-of-stock"
          } else if (item.stock <= newThreshold) {
            status = "low-stock"
          } else {
            status = "in-stock"
          }
          
          return {
            ...item,
            lowStockThreshold: newThreshold,
            status,
          }
        }
        return item
      })
    )
  }

  // Handle stock adjustment
  const handleStockAdjustment = async (id: string) => {
    if (!adjustmentAmount || !adjustmentReason) return
    
    try {
      setIsSubmitting(true)
      
      if (onStockAdjust) {
        await onStockAdjust(id, adjustmentAmount, adjustmentReason)
      }
      
      // Update local state
      updateStock(id, items.find(item => item.id === id)!.stock + adjustmentAmount)
      
      toast({
        title: "Stock adjusted",
        description: `Stock has been ${adjustmentAmount > 0 ? "increased" : "decreased"} by ${Math.abs(adjustmentAmount)}.`,
      })
      
      // Reset adjustment form
      setAdjustmentItem(null)
      setAdjustmentAmount(0)
      setAdjustmentReason("restock")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error adjusting stock",
        description: "There was a problem adjusting the stock level.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save all inventory changes
  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await onSave(items)
      toast({
        title: "Inventory saved",
        description: "Inventory changes have been saved successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error saving inventory",
        description: "There was a problem saving your inventory changes.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
      case "low-stock":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>
          Manage stock levels and set low stock thresholds for your products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.variant || "—"}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={item.lowStockThreshold}
                    onChange={(e) => updateLowStockThreshold(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdjustmentItem(item.id)}
                  >
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {adjustmentItem && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">
              Adjust Stock: {items.find((item) => item.id === adjustmentItem)?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adjustment
                </label>
                <div className="flex">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentAmount((prev) => prev - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value))}
                    className="mx-2 w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentAmount((prev) => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reason
                </label>
                <Select
                  value={adjustmentReason}
                  onValueChange={setAdjustmentReason}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restock">Restock</SelectItem>
                    <SelectItem value="returned">Customer Return</SelectItem>
                    <SelectItem value="damaged">Damaged Goods</SelectItem>
                    <SelectItem value="correction">Inventory Correction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => handleStockAdjustment(adjustmentItem)}
                  disabled={isSubmitting || adjustmentAmount === 0}
                  className="mr-2"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAdjustmentItem(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Inventory
        </Button>
      </CardFooter>
    </Card>
  )
} 