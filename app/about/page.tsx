import { Metadata } from 'next'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Us | EStore',
  description: 'Learn more about EStore and our mission',
}

export default function AboutPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground">
            EStore was founded with a simple mission: to provide high-quality products
            at competitive prices while delivering exceptional customer service. Since
            our inception, we have grown to become a trusted name in online retail,
            serving customers worldwide.
          </p>
          <p className="text-muted-foreground">
            We believe in building lasting relationships with our customers and
            suppliers, ensuring that every interaction with EStore is a positive one.
            Our team is dedicated to continuous improvement and innovation, always
            striving to enhance your shopping experience.
          </p>
        </div>
        
        <Card className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c"
            alt="Our team at work"
            fill
            className="object-cover"
          />
        </Card>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
          <p className="text-muted-foreground">
            To provide our customers with the best online shopping experience through
            innovation, extensive product selection, and exceptional service.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
          <p className="text-muted-foreground">
            To become the world's most customer-centric online marketplace, where
            customers can find and discover anything they want to buy.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Our Values</h3>
          <p className="text-muted-foreground">
            Customer obsession, ownership, innovation, and delivering results through
            simplicity and reliability.
          </p>
        </Card>
      </div>
    </div>
  )
} 