"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface SalesData {
  name: string
  total: number
}

export function Overview() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Get the current URL's origin
        const origin = window.location.origin
        const response = await fetch(`${origin}/api/admin/sales`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch sales data")
        }

        const salesData = await response.json()
        setData(salesData)
      } catch (error) {
        console.error("Error fetching sales data:", error)
        // Use sample data as fallback
        setData([
          { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
          { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
