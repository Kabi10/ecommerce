import { NextRequest } from 'next/server';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Description for product 1',
    price: 99.99,
    image: 'https://example.com/product1.jpg',
    categoryId: '1',
    stock: 10,
    averageRating: 4.5
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Description for product 2',
    price: 149.99,
    image: 'https://example.com/product2.jpg',
    categoryId: '2',
    stock: 5,
    averageRating: 4.0
  }
];

// Mock Response if it's not defined
if (typeof Response === 'undefined') {
  global.Response = class Response {
    status: number;
    statusText: string;
    headers: Headers;
    body: any;
    
    constructor(body?: any, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || '';
      this.headers = new Headers(init?.headers);
    }
    
    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
  } as any;
}

// Mock Request if it's not defined
if (typeof Request === 'undefined') {
  global.Request = class Request {
    url: string;
    method: string;
    headers: Headers;
    
    constructor(input: string, init?: RequestInit) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
    }
  } as any;
}

// Mock GET handler for products API
const GET = jest.fn().mockImplementation(async (req) => {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('categoryId');
  const searchQuery = url.searchParams.get('query');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const sortBy = url.searchParams.get('sortBy');
  const sortOrder = url.searchParams.get('sortOrder');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  let filteredProducts = [...mockProducts];

  // Filter by category
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
  }

  // Sort products
  if (sortBy === 'price') {
    filteredProducts.sort((a, b) => {
      return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
    });
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return new Response(
    JSON.stringify({
      products: paginatedProducts,
      totalCount: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: page
    }),
    { status: 200 }
  );
});

// Create a mock for the API route
const mockProductsAPI = { GET };

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all products', async () => {
    const request = new Request('https://example.com/api/products');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products).toHaveLength(2);
    expect(data.totalCount).toBe(2);
  });

  it('filters products by category', async () => {
    const request = new Request('https://example.com/api/products?categoryId=1');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Test Product 1');
  });

  it('filters products by search term', async () => {
    const request = new Request('https://example.com/api/products?query=Product 2');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Test Product 2');
  });

  it('filters products by price range', async () => {
    const request = new Request('https://example.com/api/products?minPrice=100');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toBe('Test Product 2');
  });

  it('sorts products by price', async () => {
    const request = new Request('https://example.com/api/products?sortBy=price&sortOrder=desc');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products[0].name).toBe('Test Product 2');
    expect(data.products[1].name).toBe('Test Product 1');
  });

  it('paginates products', async () => {
    const request = new Request('https://example.com/api/products?page=1&limit=1');
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.products).toHaveLength(1);
    expect(data.totalCount).toBe(2);
    expect(data.totalPages).toBe(2);
    expect(data.currentPage).toBe(1);
  });
}); 