import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Input validation schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  sortBy: z.enum(["createdAt", "total", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const validatedQuery = querySchema.parse({
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
      search: url.searchParams.get("search"),
      status: url.searchParams.get("status"),
      sortBy: url.searchParams.get("sortBy"),
      sortOrder: url.searchParams.get("sortOrder"),
    })

    // Build where clause
    const where = {
      ...(validatedQuery.status && { status: validatedQuery.status }),
      ...(validatedQuery.search && {
        OR: [
          { id: { contains: validatedQuery.search, mode: "insensitive" } },
          { user: { email: { contains: validatedQuery.search, mode: "insensitive" } } },
          { user: { name: { contains: validatedQuery.search, mode: "insensitive" } } },
        ],
      }),
    }

    // Calculate skip value for pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit

    // Fetch orders with pagination, filtering, and sorting
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          payment: {
            select: {
              status: true,
            },
          },
        },
        orderBy: {
          [validatedQuery.sortBy]: validatedQuery.sortOrder,
        },
        skip,
        take: validatedQuery.limit,
      }),
      prisma.order.count({ where }),
    ])

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.user.name || "Anonymous",
        email: order.user.email,
        image: order.user.image,
      },
      items: order.orderItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      total: Number(order.total),
      status: order.status,
      paymentStatus: order.payment?.[0]?.status || "PENDING",
      createdAt: order.createdAt,
    }))

    return NextResponse.json({
      orders: formattedOrders,
      total,
      totalPages: Math.ceil(total / validatedQuery.limit),
      currentPage: validatedQuery.page,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }

    console.error("[ORDERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const body = await req.json()
    const { ids, status } = z.object({
      ids: z.array(z.string()),
      status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
    }).parse(body)

    // Update multiple orders
    await prisma.order.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status,
      },
    })

    return new NextResponse("Orders updated", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }

    console.error("[ORDERS_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 