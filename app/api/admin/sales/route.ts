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

    // Get current year
    const currentYear = new Date().getFullYear()

    // Get sales data for each month of the current year
    const salesData = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const startDate = new Date(currentYear, i, 1)
        const endDate = new Date(currentYear, i + 1, 0)

        const result = await db.payment.aggregate({
          where: {
            status: PaymentStatus.COMPLETED,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        })

        return {
          name: new Date(currentYear, i).toLocaleString("default", { month: "short" }),
          total: result._sum.amount?.toNumber() || 0,
        }
      })
    )

    return NextResponse.json(salesData)
  } catch (error) {
    console.error("[SALES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 