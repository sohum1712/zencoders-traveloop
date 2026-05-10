<div align="center">
  <video src="./landingpage.mp4" width="100%" autoplay loop muted playsinline></video>
  
  # Traveloop
  
  *Intelligent Multi-City Travel Planning Made Simple*
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React.js](https://img.shields.io/badge/React.js-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

---

### Problem Statement
Planning multi-city travel is complex and fragmented. Travelers juggle multiple tools for discovery, booking, budgeting, and collaboration, leading to stress and missed opportunities.

### Solution Overview
Traveloop is an intelligent, end-to-end travel planning platform that consolidates discovery, itinerary building, budget management, and sharing into one seamless experience.

### Main Purpose
Transform travel planning from a chore into an exciting journey by providing users with intelligent tools to design, organize, and share their perfect trips.

---

## ✨ Features

### 🔐 Authentication & Security
- **🔑 Secure JWT Authentication** with refresh token rotation
- **🛡️ Role-Based Access Control** for users and admins
- **🔒 HTTP-Only Cookies** for enhanced security
- **🚫 Rate Limiting** to prevent abuse
- **✅ Input Validation** with comprehensive error handling

### 🗺️ Trip Planning
- **📝 Trip Creation** with rich metadata and cover images
- **📅 Date Management** with intelligent validation
- **🎯 Smart Budgeting** with real-time cost calculation
- **👁️ Public Sharing** with customizable privacy settings
- **📊 Trip Analytics** with visual insights

### 🏙️ Itinerary Builder
- **🌍 Multi-City Support** with drag-and-drop reordering
- **📅 Date Assignment** with conflict detection
- **🎯 Activity Management** with categorization
- **⏰ Time Scheduling** with smart suggestions
- **📱 Mobile-Optimized** interface

### 💰 Budget Management
- **💵 Real-Time Calculation** as you plan
- **📊 Category Breakdown** with visual charts
- **⚠️ Budget Alerts** for overspending prevention
- **📈 Cost Tracking** with historical data
- **🎯 Smart Recommendations** based on preferences

### 🎒 Travel Essentials
- **✅ Smart Packing Checklists** with category organization
- **📝 Trip Notes** with rich text support
- **🔔 Reminders** for important dates
- **📋 Document Storage** for travel documents
- **🌐 Offline Access** for essential information

### 🤖 Optional AI Enhancements
- **🧠 Smart Itinerary Generation** based on preferences
- **💡 Activity Recommendations** using ML insights
- **🎨 Personalized Suggestions** from travel history
- **📊 Budget Optimization** with AI assistance
- **🌟 Destination Insights** with real-time data

### 📱 User Experience
- **📱 Responsive Design** for all devices
- **🎨 Modern UI** with Tailwind CSS and shadcn/ui
- **⚡ Lightning Fast** with optimized performance
- **🌙 Dark Mode** support
- **♿ Accessibility** with WCAG 2.1 compliance

---

## 🛠️ Tech Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.x | UI library with hooks |
| **Vite** | 5.x | Build tool and dev server |
| **TypeScript** | 5.x | Type-safe development |
| **React Router DOM** | 6.x | Client-side routing |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **shadcn/ui** | Latest | Component library |
| **Framer Motion** | Latest | Smooth animations |
| **Zustand** | Latest | State management |
| **TanStack Query** | Latest | Server state management |
| **React Hook Form** | Latest | Form handling |
| **Zod** | Latest | Schema validation |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.x | Type-safe development |
| **Prisma** | 5.x | Database ORM |
| **JWT** | Latest | Authentication |
| **Zod** | Latest | Schema validation |
| **Winston** | Latest | Logging |

### Database Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 15.x | Primary database |
| **Prisma** | 5.x | Database ORM |
| **Redis** | 7.x | Caching (optional) |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| **Custom JWT** | Authentication with refresh tokens |
| **bcrypt** | Password hashing |
| **Helmet** | Security headers |
| **CORS** | Cross-origin resource sharing |
| **Rate Limiting** | API abuse prevention |

### Deployment
| Platform | Purpose |
|----------|---------|
| **Vercel/Netlify** | Frontend hosting |
| **Railway/Render** | Backend hosting |
| **Cloudinary** | Image storage |
| **OpenAI** | AI features |

---

## 🏗️ Architecture Overview

### Modular Architecture
Traveloop follows a **feature-based modular architecture** where each feature (auth, trips, itinerary, etc.) is completely self-contained with its own controllers, services, repositories, and DTOs.

```
src/modules/
├── auth/          # Authentication module
├── users/         # User management
├── trips/         # Trip CRUD operations
├── itinerary/     # Itinerary building
├── activities/    # Activity management
├── budget/        # Budget calculations
├── notes/         # Trip notes
├── packing/       # Packing checklists
├── community/     # Community & Collaboration Module
└── ai/           # AI-powered features (optional)
```

### Repository Pattern
We implement the **Repository Pattern** to abstract database operations:
- **Base Repository**: Common CRUD operations
- **Feature Repositories**: Specific business logic
- **Service Layer**: Business logic orchestration
- **Clean Abstraction**: Hide implementation details

### DTO Validation Flow
```
Request → Validation middleware → Authentication middleware → Security layer → DTO Validation → Service → Repository → Database
    ↓           ↓              ↓              ↓           ↓              ↓           ↓          ↓          ↓
  Parse     Security       JWT Token      HTTP Only   Zod Schema    Business    Prisma    PostgreSQL
  Input     Checks         Validation     Cookies     Validation    Logic       ORM       Storage
```

*All requests pass through multiple layers of validation and security before reaching the database.*

### API Versioning
All APIs are versioned for backward compatibility:
```
/api/v1/auth/login
/api/v1/trips/create
/api/v1/itinerary/build
```

---

## 📁 Folder Structure

```
traveloop/
├── frontend/                    # React.js + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── forms/         # Form components
│   │   │   └── features/      # Feature components
│   │   ├── pages/             # Page components
│   │   ├── routes/            # React Router configuration
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand stores
│   │   ├── layouts/           # Layout components
│   │   ├── lib/               # Utilities and configs
│   │   ├── utils/             # Helper functions
│   │   ├── types/             # TypeScript types
│   │   ├── context/           # React contexts
│   │   └── assets/            # Static assets
│   │   └── main.tsx           # App entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.ts        # Vite configuration
│   └── package.json
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── dto/
│   │   │   │   ├── routes/
│   │   │   │   └── validation/
│   │   │   ├── trips/
│   │   │   └── ... (other modules)
│   │   ├── shared/            # Shared utilities
│   │   │   ├── database/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── config/
│   │   └── app.ts             # Express app setup
│   ├── uploads/               # File uploads
│   └── package.json
├── database/                    # Database files
│   ├── schema.prisma          # Prisma schema
│   ├── migrations/            # Database migrations
│   └── seeds/                 # Seed data
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
├── .env.example                # Environment template
├── docker-compose.yml          # Docker setup
└── README.md
```

---

## 🗄️ Database Design

### ER Overview
Traveloop uses a **normalized relational database** with PostgreSQL to ensure data integrity and scalability. The design follows **Third Normal Form (3NF)** with proper relationships and constraints.

### Core Relationships
```
Users (1) ←→ (N) Trips
Trips (1) ←→ (N) TripStops
TripStops (1) ←→ (N) TripActivities
Cities (1) ←→ (N) Activities
Users (1) ←→ (N) UserFavorites
```

### Why PostgreSQL?
- **ACID Compliance**: Ensures data integrity
- **Advanced Features**: JSON support, full-text search
- **Scalability**: Handles complex queries efficiently
- **Reliability**: Production-grade with excellent tooling

### Why Prisma?
- **Type Safety**: Auto-generated TypeScript types
- **Query Optimization**: Efficient database queries
- **Migration Management**: Schema evolution made easy
- **Developer Experience**: Excellent DX with IntelliSense

---

## 📊 Database Schema

### Users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PRIMARY KEY | Unique identifier |
| email | String | UNIQUE, NOT NULL | User email address |
| passwordHash | String | NOT NULL | Bcrypt hashed password |
| firstName | String | VARCHAR(100) | User first name |
| lastName | String | VARCHAR(100) | User last name |
| avatarUrl | String | VARCHAR(500) | Profile picture URL |
| languagePreference | String | DEFAULT 'en' | UI language preference |
| role | UserRole | DEFAULT 'USER' | User role (USER/ADMIN) |
| isActive | Boolean | DEFAULT true | Account status |
| createdAt | DateTime | DEFAULT now() | Account creation date |
| updatedAt | DateTime | UPDATED | Last update timestamp |
| deletedAt | DateTime | NULLABLE | Soft delete timestamp |

### Trips Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PRIMARY KEY | Unique identifier |
| userId | String | FOREIGN KEY → Users | Trip owner |
| name | String | VARCHAR(200), NOT NULL | Trip name |
| description | String | TEXT | Trip description |
| coverImageUrl | String | VARCHAR(500) | Cover photo URL |
| startDate | DateTime | DATE, NOT NULL | Trip start date |
| endDate | DateTime | DATE, NOT NULL | Trip end date |
| totalBudget | Decimal | (10,2) | Total budget amount |
| isPublic | Boolean | DEFAULT false | Public visibility |
| shareToken | String | UNIQUE | Public sharing token |
| viewCount | Integer | DEFAULT 0 | Public view count |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | UPDATED | Update timestamp |
| deletedAt | DateTime | NULLABLE | Soft delete timestamp |

### Cities Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PRIMARY KEY | Unique identifier |
| name | String | VARCHAR(100), NOT NULL | City name |
| country | String | VARCHAR(100), NOT NULL | Country name |
| latitude | Decimal | (10,8) | Geographic latitude |
| longitude | Decimal | (11,8) | Geographic longitude |
| costIndex | Integer | DEFAULT 100 | Cost of living index |
| popularityScore | Integer | DEFAULT 0 | Popularity ranking |
| description | String | TEXT | City description |
| imageUrl | String | VARCHAR(500) | City image URL |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |

### TripStops Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PRIMARY KEY | Unique identifier |
| tripId | String | FOREIGN KEY → Trips | Parent trip |
| cityId | String | FOREIGN KEY → Cities | Destination city |
| arrivalDate | DateTime | DATE, NOT NULL | Arrival date |
| departureDate | DateTime | DATE, NOT NULL | Departure date |
| orderIndex | Integer | NOT NULL | Stop order |
| notes | String | TEXT | Stop notes |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | UPDATED | Update timestamp |

### Activities Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | String | PRIMARY KEY | Unique identifier |
| name | String | VARCHAR(200), NOT NULL | Activity name |
| description | String | TEXT | Activity description |
| category | String | VARCHAR(50), NOT NULL | Activity category |
| estimatedCost | Decimal | (8,2) | Estimated cost |
| durationHours | Integer | Duration in hours |
| cityId | String | FOREIGN KEY → Cities | Location city |
| imageUrl | String | VARCHAR(500) | Activity image |
| isPopular | Boolean | DEFAULT false | Popular activity |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |

### Indexes & Performance
```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trip queries
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX idx_trips_public ON trips(is_public, view_count);

-- Stop queries
CREATE INDEX idx_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_stops_city_id ON trip_stops(city_id);
CREATE INDEX idx_stops_dates ON trip_stops(arrival_date, departure_date);

-- Activity queries
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_popular ON activities(is_popular);
```

---

## 🔌 API Documentation

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | User registration | ❌ |
| POST | `/api/v1/auth/login` | User login | ❌ |
| POST | `/api/v1/auth/logout` | User logout | ✅ |
| POST | `/api/v1/auth/refresh` | Refresh token | ✅ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |

### Trip Management APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/trips` | Get user trips | ✅ |
| POST | `/api/v1/trips` | Create new trip | ✅ |
| GET | `/api/v1/trips/:id` | Get trip details | ✅ |
| PUT | `/api/v1/trips/:id` | Update trip | ✅ |
| DELETE | `/api/v1/trips/:id` | Delete trip | ✅ |
| POST | `/api/v1/trips/:id/share` | Generate share link | ✅ |
| GET | `/api/v1/trips/public` | Get public trips | ❌ |

### Itinerary APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/itinerary/:tripId` | Get trip itinerary | ✅ |
| POST | `/api/v1/itinerary/stops` | Add trip stop | ✅ |
| PUT | `/api/v1/itinerary/stops/:id` | Update stop | ✅ |
| DELETE | `/api/v1/itinerary/stops/:id` | Remove stop | ✅ |
| POST | `/api/v1/itinerary/activities` | Add activity | ✅ |
| PUT | `/api/v1/itinerary/activities/:id` | Update activity | ✅ |
| DELETE | `/api/v1/itinerary/activities/:id` | Remove activity | ✅ |

### Activity APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/activities` | Search activities | ❌ |
| GET | `/api/v1/activities/cities/:cityId` | Get city activities | ❌ |
| GET | `/api/v1/activities/popular` | Get popular activities | ❌ |
| POST | `/api/v1/activities/:id/favorite` | Favorite activity | ✅ |

### AI APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/ai/itinerary` | Generate AI itinerary | ✅ |
| POST | `/api/v1/ai/recommendations` | Get recommendations | ✅ |
| POST | `/api/v1/ai/budget-optimize` | Optimize budget | ✅ |

---

## 🔒 Security

### Authentication Security
- **JWT with Refresh Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevent XSS token theft
- **Token Rotation**: Refresh token rotation for enhanced security
- **bcrypt Hashing**: Secure password storage with salt rounds

### API Security
- **Rate Limiting**: Prevent API abuse and DDoS attacks
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers for XSS protection
- **Input Validation**: Comprehensive validation with Zod
- **SQL Injection Prevention**: Prisma ORM parameterized queries

### Data Security
- **Environment Variables**: Secure configuration management
- **File Upload Validation**: Secure file handling with type/size limits
- **HTTPS Enforcement**: SSL/TLS for all communications
- **Data Encryption**: Sensitive data encryption at rest

### Why Each Layer Matters
1. **Authentication**: Prevents unauthorized access
2. **Validation**: Ensures data integrity and prevents attacks
3. **Rate Limiting**: Protects against abuse and ensures availability
4. **HTTPS**: Encrypts data in transit
5. **Helmet**: Adds security headers to prevent common attacks

---

## 🤖 Optional AI Enhancements

### Smart Itinerary Generation (Future Enhancement)
Our AI-powered itinerary generator will create personalized travel plans based on:
- **User Preferences**: Interests, budget, travel style
- **Destination Context**: Local attractions, weather, events
- **Time Constraints**: Duration, optimal scheduling
- **Budget Optimization**: Cost-effective recommendations

*Note: AI features are planned for future releases and will be optional enhancements.*



### Fallback Handling (Future Implementation)
- **Graceful Degradation**: Template-based fallbacks if AI fails
- **Caching**: Store successful AI responses for similar requests
- **Cost Optimization**: Efficient API usage with request batching
- **Error Recovery**: Multiple fallback strategies for reliability

*AI features will be implemented as optional modules in future iterations.*

---

## 🌐 External APIs

Traveloop integrates with several external services to enhance the travel planning experience:

### Weather & Location Services
- **OpenWeather API**: Real-time weather data and forecasts for destination planning
- **Google Maps API**: Geocoding, places search, and mapping functionality

### Financial Services
- **Currency Exchange API**: Real-time currency conversion for budget planning
- **Payment Processing**: Stripe integration for future premium features

### Travel Data APIs
- **Amadeus API**: Flight and hotel data integration
- **Skyscanner API**: Price comparison and booking data
- **TripAdvisor API**: Reviews and ratings for activities and destinations

*All external API integrations are optional and can be enabled/disabled based on business requirements.*

---

## 🚀 Installation Guide

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15.x or higher
- npm or yarn package manager

### Clone Repository
```bash
git clone https://github.com/yourusername/traveloop.git
cd traveloop
```

### Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### Database Setup
```bash
# Navigate to backend
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed
```

### Start Development Servers
```bash
# Start backend (port 3001)
cd backend
npm run dev

# Start frontend (port 5173)
cd frontend
npm run dev
```

### Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database Studio**: `npx prisma studio` 

---

## 🔧 Environment Variables

### Backend Environment (.env)
```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/traveloop"

# Authentication
JWT_ACCESS_SECRET="your-super-secret-access-key-32-chars-minimum"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-32-chars-minimum"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# AI Services
OPENAI_API_KEY="your-openai-api-key"

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Logging
LOG_LEVEL="info"
```

### Frontend Environment (.env.local)
```bash
# API Configuration
VITE_API_URL="http://localhost:3001"
VITE_APP_URL="http://localhost:5173"

# Analytics (optional)
VITE_GA_ID="your-google-analytics-id"
```

---

## 📊 Database Migration Guide

### Migration Commands
```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio
```

### Seed Data
```bash
# Run seed script
npx prisma db seed

# Reset and reseed
npx prisma migrate reset --force
npx prisma db seed
```

### Migration Best Practices
- **Descriptive Names**: Use clear migration names
- **Review Changes**: Always review generated migrations
- **Backup Data**: Backup before running migrations in production
- **Test Thoroughly**: Test migrations in staging first
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Husky Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```



---

## 👨‍💻 Contributors

### Core Team
- **Soham** 
- **Vaishnav** 
- **Dharma Teja** 
- **Kumara Swamy** 

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
6. Wait for review

### Contribution Guidelines
- Follow the code style guidelines
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Be respectful and constructive

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Traveloop Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---


<div align="center">
  <p>Made with ❤️ by the zencoders Team</p>
  <p>Transforming travel planning, one journey at a time 🌍</p>
</div>
