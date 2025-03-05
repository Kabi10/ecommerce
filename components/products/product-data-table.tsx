"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { 
  ArrowUpDown,
  Copy,
  Edit,
  Eye, 
  MoreHorizontal, 
  Package, 
  Trash
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { BulkUpdateDialog } from "./bulk-update-dialog"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  stock: number
  sku: string
  createdAt: string
  updatedAt: string
  categoryId: string
  category: {
    name: string
  }
}

interface Category {
  id: string
  name: string
}

interface BulkUpdateData {
  categoryId?: string
  price?: number
  stock?: number
}

interface ProductDataTableProps {
  products: Product[]
  categories: Category[]
  onDelete: (ids: string[]) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onBulkUpdate: (ids: string[], data: BulkUpdateData) => Promise<void>
}

export function ProductDataTable({ 
  products,
  categories, 
  onDelete, 
  onDuplicate,
  onBulkUpdate 
}: ProductDataTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [updateType, setUpdateType] = useState<"category" | "price" | "stock" | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortColumn as keyof Product]
    const bValue = b[sortColumn as keyof Product]
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const toggleProductSelection = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(i => i !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return
    
    try {
      setIsDeleting(true)
      await onDelete(selectedProducts)
      setSelectedProducts([])
      toast({
        title: "Products deleted",
        description: `Successfully deleted ${selectedProducts.length} product(s)`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await onDuplicate(id)
      toast({
        title: "Product duplicated",
        description: "Successfully duplicated product",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkUpdate = async (value: string | number) => {
    try {
      if (!updateType) return

      const data: BulkUpdateData = {
        [updateType]: value
      }

      await onBulkUpdate(selectedProducts, data)
      toast({
        title: "Success",
        description: "Selected products have been updated",
      })
      setSelectedProducts([])
      setUpdateType(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update products",
        variant: "destructive",
      })
    }
  }

  if (!products?.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Get started by creating a new product.
        </p>
        <div className="mt-4">
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BulkUpdateDialog
        open={!!updateType}
        onOpenChange={(open) => !open && setUpdateType(null)}
        type={updateType || "category"}
        onUpdate={handleBulkUpdate}
        categories={categories}
        selectedCount={selectedProducts.length}
      />
      
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted">
          <span className="text-sm font-medium">
            {selectedProducts.length} products selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Update Selected</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setUpdateType("category")}>
                Update Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUpdateType("price")}>
                Update Price
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUpdateType("stock")}>
                Update Stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedProducts.length === 0 || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedProducts.length} of {products.length} selected
          </span>
        </div>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={toggleAllProducts}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("sku")}>
                <div className="flex items-center">
                  SKU
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("price")}>
                <div className="flex items-center">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("stock")}>
                <div className="flex items-center">
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  {product.images.length > 0 ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <Badge variant={product.stock > 10 ? "outline" : "destructive"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}`} className="flex items-center w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`} className="flex items-center w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(product.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete([product.id])}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 