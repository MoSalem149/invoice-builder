# Invoice Builder - Fullstack Application

A modern, responsive invoice management system with multi-language support built with React, Node.js, and MongoDB.

## 🚀 Project Overview

This is a complete fullstack application consisting of:
- **Frontend (Client)**: React + TypeScript + Tailwind CSS
- **Backend (Server)**: Node.js + Express + MongoDB

## 📁 Project Structure

```
invoice-builder/
├── client/                 # Frontend React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
└── README.md              # This file
```

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons
- Multi-language support (English/Arabic)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Express Validator
- Security middleware (Helmet, CORS, Rate Limiting)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd invoice-builder

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend (.env in server folder)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/invoice_builder
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env in client folder)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Invoice Builder
```

### 3. Start Development Servers

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌟 Features

### Core Features
- **Invoice Management**: Create, edit, and manage professional invoices
- **Client Management**: Add, archive, and organize clients
- **Product Management**: Manage products with pricing and tax rates
- **PDF Generation**: Print and download invoices as PDF
- **Multi-language Support**: English and Arabic with RTL layout
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Technical Features
- **Authentication**: JWT-based user authentication
- **Database**: MongoDB with proper indexing
- **Security**: Comprehensive security middleware
- **Validation**: Input validation on both frontend and backend
- **Error Handling**: Proper error handling and user feedback
- **Archive System**: Archive/unarchive clients and products

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

## 🌐 Internationalization

Supports multiple languages with easy extensibility:
- English (en)
- Arabic (ar) with RTL support

To add a new language:
1. Create translation file in `client/src/locales/`
2. Add language option in settings
3. Update language context

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is issued
3. Token is stored in localStorage
4. All API requests include Authorization header
5. Backend validates token for protected routes

## 📊 Database Schema

- **Users**: Authentication and user management
- **Company**: Company information and settings
- **Clients**: Customer information with archive support
- **Products**: Product catalog with pricing
- **Invoices**: Complete invoice data with items

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to Heroku, DigitalOcean, or AWS
4. Update CORS settings for production domain

### Frontend Deployment
1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to Netlify, Vercel, or any static hosting
4. Configure redirects for SPA routing

## 🔧 Development

### Adding New Features
1. Create/update database models in `server/models/`
2. Add API routes in `server/routes/`
3. Create React components in `client/src/components/`
4. Update types in `client/src/types/`
5. Add translations in `client/src/locales/`

### Code Organization
- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Type safety throughout the application
- **Context API**: State management with React Context
- **Custom Hooks**: Reusable logic with custom hooks
- **Utility Functions**: Helper functions for common tasks

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests  
cd client
npm test
```

## 📄 API Documentation

Detailed API documentation is available in the server README. All endpoints follow RESTful conventions with proper HTTP status codes and error handling.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation in client and server README files
2. Review the code comments and examples
3. Open an issue for bugs or feature requests

## 🔮 Future Enhancements

- Email integration for sending invoices
- Payment gateway integration
- Advanced reporting and analytics
- Multi-company support
- Invoice templates
- Recurring invoices
- Client portal