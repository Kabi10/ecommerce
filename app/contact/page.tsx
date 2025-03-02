import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | EStore',
  description: 'Get in touch with our team',
}

export default function ContactPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-lg text-muted-foreground mb-8">
            Have a question or need assistance? We're here to help. Fill out the form
            below and we'll get back to you as soon as possible.
          </p>
          
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    support@estore.com
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    123 Commerce Street<br />
                    Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <ContactForm />
        </Card>
      </div>
    </div>
  )
} 