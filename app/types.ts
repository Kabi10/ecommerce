export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  category: {
    id: string
    name: string
  }
  reviews: Review[]
  averageRating: number
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
  }
} 