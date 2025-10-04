# 🌊 Brainwave - FarmHelper AI

A modern, AI-powered agricultural advisory platform built with React and Vite. Brainwave provides intelligent soil analysis, crop recommendations, and farming guidance to help farmers make data-driven decisions.

## Team Details

Team: T027
Team Name : 404 Brain not found!

## ✨ Features

### 🎯 Core Functionality

- _AI-Powered Soil Analysis_: Get personalized soil advisory based on locality, crop type, and growth stage
- _Fertilizer Recommendations_: Detailed fertilizer suggestions with quantities and application timing
- _Organic Alternatives_: Eco-friendly farming options and sustainable practices
- _Irrigation Advice_: Smart watering recommendations for optimal crop growth
- _Soil Health Tips_: Expert guidance for maintaining healthy soil
- _Safety Alerts_: Important cautions and warnings for safe farming practices

### 🎨 Modern UI/UX

- _Glassmorphism Design_: Beautiful glass-like effects with backdrop blur
- _Gradient Backgrounds_: Animated gradient elements for visual appeal
- _Responsive Layout_: Seamless experience across all devices
- _Smooth Animations_: Fluid transitions and hover effects
- _Dark Theme_: Modern dark interface with excellent contrast
- _Audio Integration_: Play audio guidance for better accessibility

### 🔐 User Management

- _Secure Registration_: Email verification with OTP system
- _User Authentication_: JWT-based secure login
- _Session Management_: Persistent user sessions
- _Form Validation_: Real-time input validation and error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB (local or cloud)

### Quick Start (Recommended)

1. _Clone the repository_
   bash
   git clone https://github.com/Supanjit-Singh/FarmHelper.git
   cd FarmHelper

2. _Start Backend Server_
   bash

   # Windows

   start-backend.bat

   # Or manually

   cd server
   npm install
   npm run dev

3. _Start Frontend (in new terminal)_
   bash

   # Windows

   start-frontend.bat

   # Or manually

   cd brainwave
   npm install
   npm run dev

4. _Open your browser_
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Manual Installation

#### Backend Setup

bash
cd server
npm install
cp env.example .env

# Edit .env with your configuration

npm run dev

#### Frontend Setup

bash
cd brainwave
npm install
npm run dev

### Build for Production

bash

# Frontend

cd brainwave
npm run build

# Backend

cd server
npm start

## 🛠️ Tech Stack

### Frontend

- _React 18_ - Modern React with hooks
- _Vite_ - Fast build tool and dev server
- _Tailwind CSS_ - Utility-first CSS framework
- _React Router DOM_ - Client-side routing
- _Axios_ - HTTP client for API calls
- _React Hot Toast_ - Beautiful toast notifications

### Styling & UI

- _Custom Design System_ - Consistent color palette and typography
- _Glassmorphism Effects_ - Modern glass-like UI elements
- _Responsive Design_ - Mobile-first approach
- _Smooth Animations_ - CSS transitions and transforms

### Development Tools

- _ESLint_ - Code linting and formatting
- _PostCSS_ - CSS processing
- _Autoprefixer_ - CSS vendor prefixing

## 📁 Project Structure

brainwave/
├── public/ # Static assets
├── src/
│ ├── assets/ # Images, audio files, and icons
│ │ ├── benefits/ # Benefit section assets
│ │ ├── name.mp3 # Audio guidance files
│ │ └── email.mp3
│ ├── components/ # Reusable UI components
│ ├── pages/ # Main application pages
│ │ ├── Dashboard.jsx # Main advisory dashboard
│ │ ├── Login.jsx # User authentication
│ │ └── Register.jsx # User registration
│ ├── App.jsx # Main application component
│ └── index.css # Global styles
├── package.json # Dependencies and scripts
├── tailwind.config.js # Tailwind configuration
├── vite.config.js # Vite configuration
└── README.md # Project documentation

## 🎯 Key Pages

### Dashboard (/dashboard)

- _Soil Advisory Form_: Input locality, crop type, growth stage, and soil type
- _AI Analysis_: Get comprehensive farming recommendations
- _Response Cards_: Organized display of fertilizer, irrigation, and health tips
- _Safety Alerts_: Important cautions and warnings

### Authentication

- _Login (/login)_: Secure user authentication with audio guidance
- _Register (/register)_: User registration with email verification
- _OTP Verification_: Two-step verification process

## 🎨 Design System

### Color Palette

- _Primary Colors_: Modern gradient combinations
- _Neutral Colors_: Dark theme with proper contrast
- _Accent Colors_: Color-coded sections for different content types

### Typography

- _Headings_: Clear hierarchy with proper sizing
- _Body Text_: Readable fonts with optimal line height
- _Labels_: Consistent form labeling

### Components

- _Input Fields_: Modern rounded inputs with icons
- _Buttons_: Gradient buttons with hover effects
- _Cards_: Glassmorphism cards with backdrop blur
- _Tables_: Clean, responsive data tables

## 🔧 Available Scripts

bash

# Development

npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint

# Audio Features

# - Play audio guidance for form fields

# - Accessible audio feedback

# - MP3 audio integration

## 🌐 API Integration

The application integrates with a backend API for:

- User authentication and registration
- Soil analysis and recommendations
- Data persistence and retrieval

### API Endpoints

- POST /api/user/register - User registration
- POST /api/user/login - User authentication
- POST /api/ai/soil - Soil advisory analysis

## 🎵 Audio Features

- _Form Field Audio_: Play audio guidance for username and email fields
- _Accessibility_: Enhanced user experience with audio feedback
- _Audio Files_: Integrated MP3 audio files for guidance

## 📱 Responsive Design

- _Mobile First_: Optimized for mobile devices
- _Tablet Support_: Enhanced layout for tablet screens
- _Desktop_: Full-featured desktop experience
- _Cross-Browser_: Compatible with modern browsers

## 🔒 Security Features

- _JWT Authentication_: Secure token-based authentication
- _Input Validation_: Client and server-side validation
- _HTTPS Ready_: Secure communication protocols
- _Session Management_: Secure user session handling

## 🚀 Deployment

### Build Process

1. Run npm run build to create production build
2. Deploy the dist folder to your hosting service
3. Configure environment variables for API endpoints

### Environment Variables

env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=FarmHelper

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- _React Team_ - For the amazing React framework
- _Vite Team_ - For the fast build tool
- _Tailwind CSS_ - For the utility-first CSS framework
- _Open Source Community_ - For the amazing packages and tools

## 📞 Support

For support, email support@farmhelper.com or create an issue in the repository.

---

_Built with ❤️ for the farming community_

Empowering farmers with AI-driven agricultural insights
