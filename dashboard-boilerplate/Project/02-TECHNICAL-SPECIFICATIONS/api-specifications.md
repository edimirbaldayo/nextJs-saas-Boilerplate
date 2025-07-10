# API Specifications

## Authentication Endpoints

### POST /api/auth/signin
**Purpose**: User login
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/auth/signout
**Purpose**: User logout
**Response**:
```json
{
  "success": true
}
```

### POST /api/auth/recovery
**Purpose**: Initiate password recovery
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Recovery email sent"
}
```

### POST /api/auth/reset-password
**Purpose**: Reset password with token
**Request Body**:
```json
{
  "token": "reset_token",
  "password": "new_password"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## User Endpoints

### GET /api/user/profile
**Purpose**: Get current user profile
**Headers**: Authorization: Bearer token
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/user/profile
**Purpose**: Update user profile
**Headers**: Authorization: Bearer token
**Request Body**:
```json
{
  "name": "New Name",
  "avatar": "new_avatar_url"
}
```
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "New Name",
    "avatar": "new_avatar_url"
  }
}
```

### PUT /api/user/password
**Purpose**: Change password
**Headers**: Authorization: Bearer token
**Request Body**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## Dashboard Endpoints

### GET /api/dashboard/stats
**Purpose**: Get dashboard statistics
**Headers**: Authorization: Bearer token
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1000,
    "activeUsers": 750,
    "recentActivity": [
      {
        "id": "activity_id",
        "type": "login",
        "timestamp": "2024-01-01T00:00:00Z",
        "description": "User logged in"
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Authentication

### JWT Token Format
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### Session Management
- JWT tokens stored in HTTP-only cookies
- Token expiration: 24 hours
- Refresh token mechanism for extended sessions
- Secure cookie settings in production

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Recovery endpoints: 3 requests per hour

## CORS Configuration
```javascript
{
  origin: process.env.NEXTAUTH_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## Security Headers
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=() 