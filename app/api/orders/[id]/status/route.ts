import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendOrderShippedEmail } from "@/lib/email"

const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status } = orderStatusSchema.parse(body)
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        shippingAddress: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    })

    // Send shipping notification if status is SHIPPED
    if (status === "SHIPPED" && order.user?.email) {
      try {
        await sendOrderShippedEmail({
          orderNumber: order.id,
          customerName: order.user.email,
          items: order.orderItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          shippingAddress: order.shippingAddress,
        })
      } catch (error) {
        console.error("Failed to send shipping notification:", error)
        // Continue with the response even if email fails
      }
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }

    console.error("Error updating order status:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 