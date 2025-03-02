'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { getCategoryImage } from '@/lib/image-utils'

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string | null
  }
  productCount: number
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const image = getCategoryImage(category.name)

  return (
    <Link href={`/products?category=${category.id}`}>
      <Card className="group overflow-hidden p-0">
        <div className="relative aspect-[4/3]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h3 className="text-xl font-semibold">{category.name}</h3>
            {category.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-200">
                {category.description}
              </p>
            )}
            <p className="mt-2 text-sm font-medium">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
} 