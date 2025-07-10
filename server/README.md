# Invoice Builder - Backend (Server)

A robust Node.js/Express backend API for the Invoice Builder application with MongoDB integration.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based authentication and authorization
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling and logging
- **File Upload**: Support for company logo uploads (Cloudinary integration)

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📦 Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start MongoDB (if running locally):
```bash
mongod
```

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/invoice_builder

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Optional: File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
server/
├── models/                 # Mongoose models
│   ├── User.js            # User model
│   ├── Company.js         # Company model
│   ├── Client.js          # Client model
│   ├── Product.js         # Product model
│   └── Invoice.js         # Invoice model
├── routes/                 # Express routes
│   ├── auth.js            # Authentication routes
│   ├── company.js         # Company routes
│   ├── clients.js         # Client routes
│   ├── products.js        # Product routes
│   └── invoices.js        # Invoice routes
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication middleware
├── .env                   # Environment variables
├── server.js              # Main server file
└── README.md              # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Company
- `GET /api/company` - Get company information
- `PUT /api/company` - Update company information

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `PUT /api/clients/:id/archive` - Archive/unarchive client
- `DELETE /api/clients/:id` - Delete client

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `PUT /api/products/:id/archive` - Archive/unarchive product
- `DELETE /api/products/:id` - Delete product

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `PUT /api/invoices/:id/status` - Update invoice status
- `DELETE /api/invoices/:id` - Delete invoice

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

### User
- email, password, name, role, isActive
- Timestamps: createdAt, updatedAt

### Company
- userId (ref), name, address, logo, currency, language
- Timestamps: createdAt, updatedAt

### Client
- userId (ref), name, address, phone, email, archived
- Timestamps: createdAt, updatedAt

### Product
- userId (ref), description, price, tax, archived
- Timestamps: createdAt, updatedAt

### Invoice
- userId (ref), number, date, dueDate, client, items[], subtotal, tax, total, notes, terms, status
- Timestamps: createdAt, updatedAt

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with request limits
- **Input Validation**: Validates and sanitizes all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth

## 🚀 Deployment

### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in `.env`
3. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "errors": [] // Validation errors (if applicable)
}
```

## 🔧 Development Tools

- **Nodemon**: Auto-restart server on changes
- **Express Validator**: Input validation
- **Mongoose**: MongoDB object modeling
- **JWT**: Token-based authentication

## 📄 License

This project is licensed under the MIT License.