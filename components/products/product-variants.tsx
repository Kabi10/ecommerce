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
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Plus, Trash } from "lucide-react"
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

interface ProductVariantsProps {
  productId: string
  initialVariants?: Variant[]
  onSave: (variants: Variant[]) => Promise<void>
}

export function ProductVariants({
  productId,
  initialVariants = [],
  onSave,
}: ProductVariantsProps) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants)
  const [newVariantName, setNewVariantName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Add a new variant
  const addVariant = () => {
    if (!newVariantName.trim()) return

    const newVariant: Variant = {
      id: crypto.randomUUID(),
      name: newVariantName,
      options: [
        {
          id: crypto.randomUUID(),
          value: "",
          price: 0,
          stock: 0,
          sku: "",
        },
      ],
    }

    setVariants([...variants, newVariant])
    setNewVariantName("")
  }

  // Remove a variant
  const removeVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId))
  }

  // Add a new option to a variant
  const addVariantOption = (variantId: string) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === variantId) {
          return {
            ...variant,
            options: [
              ...variant.options,
              {
                id: crypto.randomUUID(),
                value: "",
                price: 0,
                stock: 0,
                sku: "",
              },
            ],
          }
        }
        return variant
      })
    )
  }

  // Remove an option from a variant
  const removeVariantOption = (variantId: string, optionId: string) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === variantId) {
          return {
            ...variant,
            options: variant.options.filter((option) => option.id !== optionId),
          }
        }
        return variant
      })
    )
  }

  // Update a variant option
  const updateVariantOption = (
    variantId: string,
    optionId: string,
    field: keyof VariantOption,
    value: string | number
  ) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === variantId) {
          return {
            ...variant,
            options: variant.options.map((option) => {
              if (option.id === optionId) {
                return {
                  ...option,
                  [field]: value,
                }
              }
              return option
            }),
          }
        }
        return variant
      })
    )
  }

  // Save all variants
  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await onSave(variants)
      toast({
        title: "Variants saved",
        description: "Product variants have been saved successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error saving variants",
        description: "There was a problem saving your product variants.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Add variations of your product such as size, color, or material.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No variants added yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {variants.map((variant) => (
              <div key={variant.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{variant.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Option</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variant.options.map((option) => (
                      <TableRow key={option.id}>
                        <TableCell>
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              updateVariantOption(
                                variant.id,
                                option.id,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder={`${variant.name} value`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={option.price}
                              onChange={(e) =>
                                updateVariantOption(
                                  variant.id,
                                  option.id,
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
                            step="1"
                            value={option.stock}
                            onChange={(e) =>
                              updateVariantOption(
                                variant.id,
                                option.id,
                                "stock",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={option.sku}
                            onChange={(e) =>
                              updateVariantOption(
                                variant.id,
                                option.id,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="SKU"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeVariantOption(variant.id, option.id)
                            }
                            disabled={variant.options.length === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addVariantOption(variant.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-variant">New Variant Type</Label>
            <Input
              id="new-variant"
              placeholder="e.g., Size, Color, Material"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
            />
          </div>
          <Button onClick={addVariant} disabled={!newVariantName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Variants
        </Button>
      </CardFooter>
    </Card>
  )
} 