import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderShippedEmail } from '@/lib/email'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can update order status
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status } = updateOrderSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })

    // Send shipping notification if status changed to SHIPPED
    if (status === 'SHIPPED') {
      try {
        await sendOrderShippedEmail({
          orderNumber: order.id,
          customerName: order.user.name || order.user.email,
          items: order.orderItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          shippingAddress: {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          },
        })
      } catch (error) {
        console.error('Error sending shipping notification:', error)
        // Don't throw error here, as we don't want to affect the order update
      }
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 