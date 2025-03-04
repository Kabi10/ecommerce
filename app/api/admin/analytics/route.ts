import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { OrderStatus } from '@prisma/client'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    // Get current date and date 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const previousThirtyDaysAgo = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total revenue and order count (from completed orders in the last 30 days)
    const currentPeriodStats = await prisma.order.aggregate({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        total: true,
      },
      _count: true,
    })

    // Get previous period stats for comparison
    const previousPeriodStats = await prisma.order.aggregate({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: previousThirtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      _sum: {
        total: true,
      },
      _count: true,
    })

    // Calculate metrics
    const currentRevenue = currentPeriodStats._sum.total?.toNumber() || 0
    const previousRevenue = previousPeriodStats._sum.total?.toNumber() || 0
    const revenueChange = previousRevenue === 0 
      ? 100 
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100

    const currentOrders = currentPeriodStats._count
    const previousOrders = previousPeriodStats._count
    const orderChange = previousOrders === 0 
      ? 100 
      : ((currentOrders - previousOrders) / previousOrders) * 100

    // Calculate average order value
    const currentAOV = currentOrders === 0 ? 0 : currentRevenue / currentOrders
    const previousAOV = previousOrders === 0 ? 0 : previousRevenue / previousOrders
    const aovChange = previousAOV === 0 
      ? 100 
      : ((currentAOV - previousAOV) / previousAOV) * 100

    // Get customer metrics
    const currentCustomers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    const previousCustomers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousThirtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    const customerChange = previousCustomers === 0 
      ? 100 
      : ((currentCustomers - previousCustomers) / previousCustomers) * 100

    // Get daily sales data for the last 30 days
    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        COALESCE(SUM(total), 0) as revenue
      FROM "Order"
      WHERE created_at >= ${thirtyDaysAgo}
      AND status = ${OrderStatus.DELIVERED}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Get order status distribution
    const orderStatusStats = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get low stock products (less than 10 items)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
      take: 5,
    })

    // Get top products by sales
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalRevenue: currentRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      totalOrders: currentOrders,
      orderChange: Math.round(orderChange * 10) / 10,
      totalCustomers: currentCustomers,
      customerChange: Math.round(customerChange * 10) / 10,
      averageOrderValue: currentAOV,
      aovChange: Math.round(aovChange * 10) / 10,
      dailySales,
      orderStatusStats,
      lowStockProducts,
      topProducts,
      recentOrders,
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    )
  }
} 