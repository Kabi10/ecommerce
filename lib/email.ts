import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'orders@estore.com'

interface OrderEmailProps {
  orderNumber: string
  customerName: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerName,
  total,
  items,
  shippingAddress,
}: OrderEmailProps) {
  const subject = `Order Confirmation #${orderNumber}`
  
  const itemsList = items
    .map(
      (item) =>
        `${item.name} x${item.quantity} - $${item.price.toFixed(2)}`
    )
    .join('\n')

  const address = [
    shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode,
    shippingAddress.country,
  ].join(', ')

  const html = `
    <h1>Thank you for your order!</h1>
    <p>Dear ${customerName},</p>
    <p>We're pleased to confirm your order #${orderNumber}.</p>
    
    <h2>Order Details</h2>
    <pre>${itemsList}</pre>
    
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    
    <h2>Shipping Address</h2>
    <p>${address}</p>
    
    <p>We'll send you another email when your order ships.</p>
    
    <p>Thank you for shopping with us!</p>
  `

  return resend.emails.send({
    from: FROM_EMAIL,
    to: customerName,
    subject,
    html,
  })
}

export async function sendOrderShippedEmail({
  orderNumber,
  customerName,
  items,
  shippingAddress,
}: Omit<OrderEmailProps, 'total'>) {
  const subject = `Your Order #${orderNumber} Has Shipped!`
  
  const itemsList = items
    .map(
      (item) =>
        `${item.name} x${item.quantity}`
    )
    .join('\n')

  const address = [
    shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode,
    shippingAddress.country,
  ].join(', ')

  const html = `
    <h1>Your Order is on its Way!</h1>
    <p>Dear ${customerName},</p>
    <p>Great news! Your order #${orderNumber} has been shipped.</p>
    
    <h2>Order Details</h2>
    <pre>${itemsList}</pre>
    
    <h2>Shipping Address</h2>
    <p>${address}</p>
    
    <p>Thank you for shopping with us!</p>
  `

  return resend.emails.send({
    from: FROM_EMAIL,
    to: customerName,
    subject,
    html,
  })
} 