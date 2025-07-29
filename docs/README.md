# AstroInsight Documentation

## Overview

Welcome to the comprehensive documentation for AstroInsight, a React-based web application that provides users with access to NASA's space exploration data through multiple APIs. This documentation covers all aspects of the application, from setup and development to deployment and best practices.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Documentation Structure](#documentation-structure)
3. [Architecture Overview](#architecture-overview)
4. [Development Guidelines](#development-guidelines)
5. [Contributing](#contributing)
6. [Support](#support)

## Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- MongoDB 5.0 or higher
- NASA API key (register at [api.nasa.gov](https://api.nasa.gov/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd astroinsight

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

### Environment Configuration

**Backend (.env):**
```env
MONGO=mongodb://localhost:27017/astroinsight
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

**Frontend (.env):**
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_NASA_API_KEY=your_nasa_api_key_here
```

## Documentation Structure

This documentation is organized into several comprehensive guides:

### 📚 Core Documentation

| Document | Description | Target Audience |
|----------|-------------|-----------------|
| **[API Documentation](./API_DOCUMENTATION.md)** | Complete backend API reference with endpoints, request/response examples, and authentication | Backend developers, API consumers |
| **[Components Documentation](./COMPONENTS_DOCUMENTATION.md)** | Frontend React components with props, usage examples, and patterns | Frontend developers, UI developers |
| **[Redux Documentation](./REDUX_DOCUMENTATION.md)** | State management patterns, actions, reducers, and selectors | Frontend developers, state management |
| **[NASA API Integration](./NASA_API_INTEGRATION.md)** | NASA APIs integration, data structures, and implementation patterns | Full-stack developers, API integration |
| **[Setup and Deployment](./SETUP_AND_DEPLOYMENT.md)** | Complete setup guide for development and production deployment | DevOps, developers, system administrators |
| **[Usage Examples and Best Practices](./USAGE_EXAMPLES_AND_BEST_PRACTICES.md)** | Code examples, patterns, and development best practices | All developers, code reviewers |

### 🎯 Quick Reference

- **New Developer?** Start with [Setup and Deployment](./SETUP_AND_DEPLOYMENT.md)
- **Working on Frontend?** Check [Components Documentation](./COMPONENTS_DOCUMENTATION.md) and [Redux Documentation](./REDUX_DOCUMENTATION.md)
- **Building APIs?** Refer to [API Documentation](./API_DOCUMENTATION.md)
- **Integrating NASA APIs?** See [NASA API Integration](./NASA_API_INTEGRATION.md)
- **Need Code Examples?** Browse [Usage Examples and Best Practices](./USAGE_EXAMPLES_AND_BEST_PRACTICES.md)

## Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External APIs │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (NASA APIs)   │
│                 │    │                 │    │                 │
│ • Components    │    │ • Authentication│    │ • APOD          │
│ • Redux Store   │    │ • User Management│   │ • Mars Rover    │
│ • NASA API UI   │    │ • API Proxy     │    │ • Near Earth    │
│                 │    │                 │    │ • Earth Imagery │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│   Database      │
                        │   (MongoDB)     │
                        │                 │
                        │ • User Data     │
                        │ • Sessions      │
                        │ • Cache         │
                        └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.x
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router DOM
- **UI Framework**: Bootstrap 5 + Material-UI
- **HTTP Client**: Axios
- **Build Tool**: Create React App

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Middleware**: CORS, body-parser, cookie-parser

#### External APIs
- **NASA APOD**: Astronomy Picture of the Day
- **NASA Mars Rover Photos**: Mars surface imagery
- **NASA NeoWs**: Near Earth Object data
- **NASA Earth API**: Earth satellite imagery

### Key Features

- 🔐 **User Authentication**: Secure JWT-based authentication
- 🌌 **NASA API Integration**: Multiple NASA APIs for space data
- 📱 **Responsive Design**: Mobile-first responsive interface
- 🔄 **Real-time Data**: Live NASA data fetching and display
- 🎨 **Modern UI**: Clean, intuitive user interface
- 🚀 **Performance Optimized**: Lazy loading, caching, and optimization
- 🧪 **Well Tested**: Comprehensive test coverage
- 📚 **Fully Documented**: Complete documentation for all components

## Development Guidelines

### Code Standards

- **JavaScript**: ES6+ syntax, functional programming patterns
- **React**: Functional components with hooks, no class components
- **Styling**: Bootstrap classes with custom CSS modules
- **Testing**: Jest and React Testing Library
- **Linting**: ESLint with Prettier for code formatting

### Git Workflow

```bash
# Feature development
git checkout -b feature/feature-name
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create pull request

# Bug fixes
git checkout -b fix/bug-description
git commit -m "fix: resolve bug description"
git push origin fix/bug-description
# Create pull request
```

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(auth): add user registration endpoint
- fix(ui): resolve mobile navigation issue
- docs(api): update authentication documentation
```

### Testing Requirements

- **Unit Tests**: All utility functions and components
- **Integration Tests**: API endpoints and user flows
- **E2E Tests**: Critical user journeys
- **Coverage**: Minimum 80% code coverage

### Performance Guidelines

- **Bundle Size**: Keep chunks under 250KB
- **Loading Time**: First contentful paint under 2 seconds
- **Core Web Vitals**: Meet Google's Core Web Vitals standards
- **Accessibility**: WCAG 2.1 AA compliance

## Contributing

### Getting Started

1. **Fork the repository** and clone your fork
2. **Read the documentation** thoroughly
3. **Set up your development environment** using the setup guide
4. **Choose an issue** or propose a new feature
5. **Create a feature branch** from main
6. **Make your changes** following our coding standards
7. **Write tests** for your changes
8. **Update documentation** if needed
9. **Submit a pull request** with a clear description

### Development Process

```bash
# 1. Set up development environment
npm run setup  # Installs all dependencies

# 2. Start development servers
npm run dev    # Starts both frontend and backend

# 3. Run tests
npm run test   # Runs all tests
npm run test:watch  # Runs tests in watch mode

# 4. Build for production
npm run build  # Creates production builds

# 5. Deploy
npm run deploy # Deploys to staging/production
```

### Pull Request Guidelines

- **Clear Title**: Descriptive title explaining the change
- **Detailed Description**: What, why, and how of your changes
- **Issue Reference**: Link to related issues
- **Screenshots**: For UI changes, include before/after screenshots
- **Testing**: Describe how you tested your changes
- **Documentation**: Update relevant documentation
- **Breaking Changes**: Clearly mark any breaking changes

### Code Review Process

1. **Automated Checks**: All CI checks must pass
2. **Peer Review**: At least one team member review required
3. **Documentation Review**: Ensure documentation is updated
4. **Testing Verification**: Verify test coverage and quality
5. **Performance Impact**: Assess performance implications
6. **Security Review**: Check for security vulnerabilities

## Support

### Getting Help

- **Documentation**: Check this comprehensive documentation first
- **Issues**: Search existing [GitHub Issues](../../issues) or create a new one
- **Discussions**: Join [GitHub Discussions](../../discussions) for questions
- **Wiki**: Check the [project wiki](../../wiki) for additional resources

### Issue Reporting

When reporting issues, please include:

```markdown
**Environment:**
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Node.js version: [e.g., 16.14.0]
- npm version: [e.g., 8.3.1]
- Browser: [e.g., Chrome 98, Firefox 97]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Additional Context:**
Add any other context about the problem here.
```

### Feature Requests

For feature requests, please use this template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation Ideas**
If you have ideas about how this could be implemented, please share them.
```

### Community Guidelines

- **Be Respectful**: Treat all community members with respect
- **Be Constructive**: Provide helpful, constructive feedback
- **Be Patient**: Maintainers are volunteers with limited time
- **Be Clear**: Communicate clearly and provide necessary context
- **Follow Guidelines**: Adhere to all project guidelines and standards

### Maintenance and Updates

- **Regular Updates**: Documentation is updated with each release
- **Version Compatibility**: Documentation matches the current version
- **Deprecation Notices**: Deprecated features are clearly marked
- **Migration Guides**: Provided for major version updates

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- **NASA**: For providing free access to space exploration APIs
- **React Community**: For the amazing ecosystem and tools
- **Contributors**: All developers who have contributed to this project
- **Open Source**: Built on the shoulders of open source giants

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainers**: [Project Team](../../graphs/contributors)

For the most up-to-date information, always refer to the latest version of this documentation in the main branch.