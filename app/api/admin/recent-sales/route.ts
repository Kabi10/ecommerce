import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { PaymentStatus } from "@prisma/client"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    // Get the 5 most recent completed payments with user information
    const recentSales = await db.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        amount: true,
        order: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    })

    // Transform the data to match our interface
    const formattedSales = recentSales.map((sale) => ({
      id: sale.id,
      amount: sale.amount.toNumber(),
      customer: {
        name: sale.order.user.name || "Anonymous",
        email: sale.order.user.email,
        image: sale.order.user.image,
      },
    }))

    return NextResponse.json(formattedSales)
  } catch (error) {
    console.error("[RECENT_SALES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 