# FoodHub - Food Delivery Application

A modern React-based food delivery application with real-time order tracking, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Menu Display**: Browse delicious food items with images, descriptions, and prices
- **Shopping Cart**: Add items, adjust quantities, and manage your order
- **Order Placement**: Secure checkout with delivery details
- **Real-Time Order Status**: Track your order from "Received" to "Delivered"
- **REST API Integration**: Connects to Spring Boot backend
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **API**: REST API with Spring Boot backend
- **Testing**: Vitest, React Testing Library
- **CI/CD**: GitHub Actions (recommended) or Jenkins

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/dhruvrajsinh-7/FoodHub.git
cd FoodHub

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your API URL
# VITE_API_BASE_URL=http://localhost:8080/api
```

## 🏃 Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Format code
npm run format

# Check code formatting
npm run format:check

# Lint code
npm run lint

# Run all CI checks locally
npm run ci
```

## 🧪 Testing

The project uses Vitest for unit testing and React Testing Library for component testing.

### Test Coverage

- ✅ API Service Tests (12 tests) - CRUD operations, error handling
- ✅ Component Tests - UI components, form validation, user interactions
- ✅ Input Validation Tests - Form validation, error messages


## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

### API Endpoints

The application expects the following Spring Boot API endpoints:

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status

## 🏗️ Project Structure

```
FoodHub/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── __tests__/      # Component tests
│   ├── context/            # React Context providers
│   ├── services/           # API service layer
│   │   └── __tests__/     # API tests
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── test/               # Test utilities
│   └── assets/             # Static assets
├── .github/workflows/          # GitHub Actions workflows
├── Jenkinsfile                 # Jenkins pipeline (alternative)
├── vitest.config.ts        # Vitest configuration
└── package.json
```

## 🚢 Deployment

### Vercel Deployment

The project is configured for easy deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL` - Your backend API URL (e.g., `https://your-api.vercel.app/api`)
   - `VITE_ENV` - Environment (e.g., `production`)
3. **Deploy** - Vercel will automatically detect the Vite configuration and deploy

The `vercel.json` file includes:
- ✅ SPA routing configuration (all routes serve `index.html`)
- ✅ Asset caching headers for optimal performance
- ✅ Build and output directory settings

**Note**: Make sure to update `VITE_API_BASE_URL` in Vercel's environment variables to point to your production API.

### CI/CD Pipeline

The project includes a Jenkins pipeline that runs on every push/PR:

1. ✅ Code Formatting Check
2. ✅ Linting
3. ✅ Type Checking
4. ✅ Run Tests
5. ✅ Generate Coverage
6. ✅ Build Application


## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run lint` | Run ESLint |
| `npm run serve` | Serve built app on port 4173 |
| `npm run ci` | Run all CI checks locally |

## 🎨 UI Components

Built with shadcn/ui components:
- Button, Badge, Card
- Input, Label, Form components
- Sheet (Drawer), ScrollArea
- Toast notifications
- Tooltip

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run ci` to ensure all checks pass locally
4. Push and create a pull request
5. GitHub Actions will automatically run checks (or Jenkins if configured)

## 📄 License


## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- Tailwind CSS for styling
- Vitest for testing framework
- React team for the amazing framework

---

**CI Status**: ![CI](https://github.com/dhruvrajsinh-7/FoodHub/workflows/CI%20Pipeline/badge.svg)
