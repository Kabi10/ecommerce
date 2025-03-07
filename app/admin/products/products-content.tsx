"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductDataTable } from "@/components/products/product-data-table"
import { ProductFilters } from "@/components/products/product-filters"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductForm } from "@/components/products/product-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductVariants } from "@/components/products/product-variants"
import { InventoryManagement } from "@/components/products/inventory-management"

// This would come from your API
const categories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Kitchen" },
  { id: "4", name: "Books" },
  { id: "5", name: "Toys" },
]

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation",
    price: 129.99,
    images: ["https://placehold.co/300x300/png"],
    stock: 45,
    sku: "WH-001",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
    categoryId: "1",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Fitness tracker and smartwatch with heart rate monitor",
    price: 199.99,
    images: ["https://placehold.co/300x300/png"],
    stock: 28,
    sku: "SW-002",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-07-05"),
    categoryId: "1",
  },
  {
    id: "3",
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt in various colors",
    price: 24.99,
    images: ["https://placehold.co/300x300/png"],
    stock: 120,
    sku: "TS-003",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-08-15"),
    categoryId: "2",
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    images: ["https://placehold.co/300x300/png"],
    stock: 15,
    sku: "CM-004",
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-09-10"),
    categoryId: "3",
  },
  {
    id: "5",
    name: "Bestselling Novel",
    description: "The latest bestselling fiction novel",
    price: 18.99,
    images: ["https://placehold.co/300x300/png"],
    stock: 75,
    sku: "BK-005",
    createdAt: new Date("2023-05-12"),
    updatedAt: new Date("2023-10-01"),
    categoryId: "4",
  },
]

// Mock inventory items
const mockInventoryItems = mockProducts.map(product => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  stock: product.stock,
  lowStockThreshold: 20,
  status: product.stock === 0 
    ? "out-of-stock" 
    : product.stock <= 20 
      ? "low-stock" 
      : "in-stock",
  variant: undefined,
}))

export function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [products, setProducts] = useState(mockProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [inventoryItems, setInventoryItems] = useState(mockInventoryItems)

  // Filter products based on search params
  const filteredProducts = products.filter(product => {
    const searchTerm = searchParams.get("search")?.toLowerCase()
    const categoryId = searchParams.get("category")
    const stockStatus = searchParams.get("stock")
    
    let matchesSearch = true
    let matchesCategory = true
    let matchesStock = true
    
    if (searchTerm) {
      matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
    }
    
    if (categoryId) {
      matchesCategory = product.categoryId === categoryId
    }
    
    if (stockStatus) {
      switch (stockStatus) {
        case "in-stock":
          matchesStock = product.stock > 20
          break
        case "low-stock":
          matchesStock = product.stock > 0 && product.stock <= 20
          break
        case "out-of-stock":
          matchesStock = product.stock === 0
          break
      }
    }
    
    return matchesSearch && matchesCategory && matchesStock
  })

  // Handle product deletion
  const handleDeleteProducts = async (productIds: string[]) => {
    try {
      // In a real app, you would call your API here
      // await deleteProducts(productIds)
      
      // Update local state
      setProducts(products.filter(product => !productIds.includes(product.id)))
      
      toast({
        title: "Products deleted",
        description: `Successfully deleted ${productIds.length} product(s)`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      })
    }
  }

  // Handle product duplication
  const handleDuplicateProduct = async (productId: string) => {
    try {
      const productToDuplicate = products.find(p => p.id === productId)
      if (!productToDuplicate) return
      
      const newProduct = {
        ...productToDuplicate,
        id: crypto.randomUUID(),
        name: `${productToDuplicate.name} (Copy)`,
        sku: `${productToDuplicate.sku}-COPY`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      // In a real app, you would call your API here
      // await createProduct(newProduct)
      
      // Update local state
      setProducts([...products, newProduct])
      
      toast({
        title: "Product duplicated",
        description: `Successfully duplicated ${productToDuplicate.name}`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive",
      })
    }
  }

  // Handle product form submission
  const handleProductSubmit = async (data: any) => {
    try {
      if (currentProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === currentProduct.id ? { ...p, ...data, updatedAt: new Date() } : p
        )
        setProducts(updatedProducts)
        
        toast({
          title: "Product updated",
          description: `Successfully updated ${data.name}`,
        })
      } else {
        // Create new product
        const newProduct = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        setProducts([...products, newProduct])
        
        toast({
          title: "Product created",
          description: `Successfully created ${data.name}`,
        })
      }
      
      // Close dialog
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setCurrentProduct(null)
      
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  // Handle inventory save
  const handleInventorySave = async (items: any[]) => {
    try {
      // In a real app, you would call your API here
      // await updateInventory(items)
      
      // Update local state
      setInventoryItems(items)
      
      // Also update product stock
      const updatedProducts = products.map(product => {
        const inventoryItem = items.find(item => item.id === product.id)
        if (inventoryItem) {
          return {
            ...product,
            stock: inventoryItem.stock,
            updatedAt: new Date(),
          }
        }
        return product
      })
      
      setProducts(updatedProducts)
      
      toast({
        title: "Inventory saved",
        description: "Successfully updated inventory",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save inventory",
        variant: "destructive",
      })
    }
  }

  // Handle stock adjustment
  const handleStockAdjust = async (id: string, adjustment: number, reason: string) => {
    try {
      // In a real app, you would call your API here
      // await adjustStock(id, adjustment, reason)
      
      // For now, just log the adjustment
      console.log(`Adjusted stock for product ${id} by ${adjustment} due to ${reason}`)
      
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  // Handle variant save
  const handleVariantSave = async (variants: any[]) => {
    try {
      // In a real app, you would call your API here
      // await saveVariants(currentProduct.id, variants)
      
      toast({
        title: "Variants saved",
        description: "Successfully saved product variants",
      })
      
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ProductFilters categories={categories} basePath="/admin/products" />
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <ProductDataTable 
        products={filteredProducts}
        onDelete={handleDeleteProducts}
        onDuplicate={handleDuplicateProduct}
        onEdit={(product) => {
          setCurrentProduct(product)
          setIsEditDialogOpen(true)
          setActiveTab("general")
        }}
      />
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new product.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            categories={categories}
            onSubmit={handleProductSubmit}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Manage all aspects of your product.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="pt-4">
              {currentProduct && (
                <ProductForm 
                  product={currentProduct}
                  categories={categories}
                  onSubmit={handleProductSubmit}
                />
              )}
            </TabsContent>
            
            <TabsContent value="variants" className="pt-4">
              {currentProduct && (
                <ProductVariants
                  productId={currentProduct.id}
                  initialVariants={[]}
                  onSave={handleVariantSave}
                />
              )}
            </TabsContent>
            
            <TabsContent value="inventory" className="pt-4">
              {currentProduct && (
                <InventoryManagement
                  items={inventoryItems.filter(item => item.id === currentProduct.id)}
                  onSave={handleInventorySave}
                  onStockAdjust={handleStockAdjust}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
} 