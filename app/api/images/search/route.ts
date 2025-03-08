import { NextRequest, NextResponse } from 'next/server'
import { fetchGoogleImage, getGeneratedImageUrl } from '@/lib/image-utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }
  
  try {
    // Try to fetch from Google
    const imageUrl = await fetchGoogleImage(query)
    
    if (imageUrl) {
      return NextResponse.json({ imageUrl })
    }
    
    // If Google search fails or is not configured, use generated image
    const generatedImageUrl = getGeneratedImageUrl(query)
    return NextResponse.json({ imageUrl: generatedImageUrl })
    
  } catch (error) {
    console.error('Error searching for image:', error)
    return NextResponse.json(
      { error: 'Failed to search for image' },
      { status: 500 }
    )
  }
} 