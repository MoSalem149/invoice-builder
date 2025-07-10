# Invoice Builder - Frontend (Client)

A modern, responsive invoice management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Multi-language Support**: English and Arabic with RTL layout support
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Invoice Management**: Create, edit, and manage professional invoices
- **Client & Product Management**: Add, archive, and organize clients and products
- **PDF Generation**: Print and download invoices as PDF
- **Modern UI**: Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

## 📦 Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL

## 🔧 Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Invoice Builder
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── Create/         # Invoice creation components
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── History/        # Invoice history components
│   │   ├── Layout/         # Layout components
│   │   ├── Settings/       # Settings components
│   │   └── UI/            # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── locales/            # Translation files
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── index.css          # Global styles
├── public/                 # Static assets
└── README.md              # This file
```

## 🌐 Internationalization

The app supports multiple languages:
- English (en)
- Arabic (ar) with RTL support

To add a new language:
1. Create a new JSON file in `src/locales/`
2. Add the language option in the settings component
3. Update the language context

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS** for print styles and RTL support
- **Responsive design** with mobile-first approach

## 🔗 API Integration

The frontend communicates with the backend through RESTful APIs:
- Base URL configured via `VITE_API_URL` environment variable
- Axios for HTTP requests
- Error handling and loading states

## 📄 License

This project is licensed under the MIT License.