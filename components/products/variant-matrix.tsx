"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Variant {
  id: string
  name: string
  options: VariantOption[]
}

interface VariantOption {
  id: string
  value: string
  price: number
  stock: number
  sku: string
}

interface VariantCombination {
  id: string
  options: { [key: string]: string }
  price: number
  stock: number
  sku: string
}

interface VariantMatrixProps {
  variants: Variant[]
  onBulkUpdate: (combinations: VariantCombination[]) => Promise<void>
}

export function VariantMatrix({ variants, onBulkUpdate }: VariantMatrixProps) {
  const [combinations, setCombinations] = useState<VariantCombination[]>(
    generateCombinations(variants)
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Generate all possible combinations of variant options
  function generateCombinations(variants: Variant[]): VariantCombination[] {
    if (variants.length === 0) return []

    const combinations: VariantCombination[] = []
    const variantNames = variants.map((v) => v.name)

    function generate(
      current: { [key: string]: string },
      depth: number
    ) {
      if (depth === variants.length) {
        combinations.push({
          id: crypto.randomUUID(),
          options: { ...current },
          price: 0,
          stock: 0,
          sku: generateSKU(current),
        })
        return
      }

      const variant = variants[depth]
      for (const option of variant.options) {
        generate(
          { ...current, [variant.name]: option.value },
          depth + 1
        )
      }
    }

    generate({}, 0)
    return combinations
  }

  // Generate SKU from combination
  function generateSKU(options: { [key: string]: string }): string {
    return Object.values(options)
      .map((value) => value.toUpperCase().replace(/\s+/g, "-"))
      .join("-")
  }

  // Update a single combination
  const updateCombination = (
    id: string,
    field: keyof VariantCombination,
    value: string | number
  ) => {
    setCombinations(
      combinations.map((combo) =>
        combo.id === id
          ? { ...combo, [field]: value }
          : combo
      )
    )
  }

  // Bulk update all combinations
  const bulkUpdateField = (field: "price" | "stock", value: number) => {
    setCombinations(
      combinations.map((combo) => ({
        ...combo,
        [field]: value,
      }))
    )
  }

  // Save all combinations
  const handleSave = async () => {
    try {
      setIsUpdating(true)
      await onBulkUpdate(combinations)
      toast({
        title: "Success",
        description: "Variant combinations have been updated.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update variant combinations.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (variants.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Add variants to see the combination matrix.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Bulk update:</span>
          <Input
            type="number"
            placeholder="Price"
            className="w-24"
            min="0"
            onChange={(e) => bulkUpdateField("price", Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Stock"
            className="w-24"
            min="0"
            onChange={(e) => bulkUpdateField("stock", Number(e.target.value))}
          />
        </div>
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {variants.map((variant) => (
                <TableHead key={variant.id}>{variant.name}</TableHead>
              ))}
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinations.map((combo) => (
              <TableRow key={combo.id}>
                {variants.map((variant) => (
                  <TableCell key={variant.id}>
                    <Badge variant="outline">
                      {combo.options[variant.name]}
                    </Badge>
                  </TableCell>
                ))}
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={combo.price}
                      onChange={(e) =>
                        updateCombination(
                          combo.id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="pl-7"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={combo.stock}
                    onChange={(e) =>
                      updateCombination(
                        combo.id,
                        "stock",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={combo.sku}
                    onChange={(e) =>
                      updateCombination(
                        combo.id,
                        "sku",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 