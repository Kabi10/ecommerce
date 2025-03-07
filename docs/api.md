# API Documentation

## Authentication

### POST /api/auth/signin
Sign in with email and password.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "token": "string"
}
```

### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

## Products

### GET /api/products
Get a list of products with optional filtering.

**Query Parameters:**
- `category`: Filter by category
- `search`: Search term
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `sort`: Sort order (price_asc, price_desc, newest)
- `page`: Page number
- `limit`: Items per page

### POST /api/products
Create a new product (admin only).

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number",
  "images": "string[]"
}
```

## Orders

### GET /api/orders
Get user's orders or all orders (admin).

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

### POST /api/orders
Create a new order.

**Request:**
```json
{
  "items": [{
    "productId": "string",
    "quantity": "number"
  }],
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  }
}
```

## Cart

### GET /api/cart
Get user's cart contents.

### POST /api/cart/add
Add item to cart.

**Request:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

## Reviews

### POST /api/reviews
Create a product review.

**Request:**
```json
{
  "productId": "string",
  "rating": "number",
  "comment": "string"
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Error details"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded"
}
```

## Rate Limits

- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Search endpoints: 30 requests per minute 