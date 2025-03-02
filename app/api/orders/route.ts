import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const orderSchema = z.object({
  items: z.array(orderItemSchema),
  addressId: z.string(),
  total: z.number().positive(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = orderSchema.parse(body)

    // Verify the address belongs to the user
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      )
    }

    // Create the order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          total: validatedData.total,
          addressId: validatedData.addressId,
          orderItems: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      })

      // Update product stock
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return order
    })

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 