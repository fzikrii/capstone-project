# 📌 Capstone Project

<img width="2944" height="1664" alt="Project Banner" src="https://github.com/user-attachments/assets/b4fd7390-91cf-41c3-93d8-cdfee19f7cb8" />

**Status:** 🚧 **In Development & Planning Phase** 🚧  

Welcome to the repository for our capstone project!  
This project aims to build a **modern, professional task management website** inspired by industry leaders like **ClickUp, Trello, and Monday.com**.

---

## 🌟 Vision & Uniqueness

Our platform will not only manage tasks but also include:

- 🏆 **Achievements System**  
- 💼 **Job Board** where users can post bounties for tasks  

---

## 🎯 Project Goals

1. **📝 Enhanced User Profiles**  
   Dynamic profiles with contribution levels, progress banners, and colorful tags.

2. **🚀 Intuitive Workflow Management**  
   Manage projects seamlessly from individual tasks to team schedules.

3. **🎨 Clean & Bright UI**  
   Simple, colorful, bright interface with a clean white background.

---

## ✨ Key Features

- **Comprehensive Dashboard** – Daily/monthly recaps with charts and progress visualizations.  
- **Kanban Boards** – To Do, Ongoing, Done, Stuck with color-coded tasks.  
- **Google Authentication** – Secure OAuth login/signup.  

---

## 🗺️ Sitemap & Components

**Core Pages**
- **Landing Page** – Header, project overview, About Us, contact info.
- **Login Page** – Credential or Google Auth login.
- **Sign-Up Page** – Registration with MongoDB storage.
- **Main Dashboard** – Workspace after login.

**Dashboard Components**
- **User Profile** – Image, name, job title, expandable detail view.
- **My Projects** – All projects linked to schedule.
- **Board (Bounty Board)** – Master list of project tasks.
- **Schedule** – Integrated Google Calendar.
- **Project View** – Kanban board interface.
- **FAQ** – Help & common questions.

---

## 📂 Repository Structure

```
/client   → Frontend code (React/Vue, CSS)
/server   → Backend code (Node.js API, database models, auth)
/assets   → Static assets (images, logos, fonts)
```

---

## 💻 Tech Stack

**Frontend:** JavaScript, Tailwind CSS, Chart.js, React/Vue.js  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** Passport.js + Google OAuth 2.0  
**Tools:** Git, GitHub, VS Code  

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/capstone-project.git
cd capstone-project
```

2. Set up environment variables:
```bash
# Create .env file in root directory
cp .env.example .env
```

3. Configure your `.env` file:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret

# API Keys
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=5000
NODE_ENV=development
```

### Installation

Install dependencies for both client and server:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## 🏃‍♂️ Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📋 Available Scripts

### Client Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run tests |

---

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📊 Project Status & Roadmap

### Current Sprint (Phase 1)
- [x] Project setup and configuration
- [x] Basic UI components
- [ ] User authentication system
- [ ] Database schema design
- [ ] API endpoints development

### Upcoming Milestones
- **Phase 2:** Core functionality (Kanban boards, task management)
- **Phase 3:** User profiles and achievements system
- **Phase 4:** Job board and bounty system
- **Phase 5:** Advanced features and optimization

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Code Review Process
All submissions require review. We use GitHub pull requests for this purpose.

---

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/google         # Google OAuth
POST /api/auth/logout         # User logout
```

### Task Management Endpoints
```
GET    /api/tasks             # Get all tasks
POST   /api/tasks             # Create new task
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
```

### User Endpoints
```
GET    /api/users/profile     # Get user profile
PUT    /api/users/profile     # Update user profile
GET    /api/users/stats       # Get user statistics
```

---

## 🔒 Security

- **Authentication:** JWT tokens with Google OAuth 2.0
- **Authorization:** Role-based access control
- **Data Validation:** Input sanitization and validation
- **Security Headers:** Helmet.js implementation
- **Rate Limiting:** API request throttling

---

## 📈 Performance Optimization

- **Frontend:** Code splitting, lazy loading, image optimization
- **Backend:** Database indexing, caching strategies
- **Monitoring:** Performance metrics and logging

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Cannot connect to MongoDB
```bash
# Solution: Check your MongoDB connection string in .env
MONGODB_URI=mongodb://localhost:27017/capstone-db
```

**Issue:** Google OAuth not working
```bash
# Solution: Verify your Google Client credentials
# Make sure redirect URI is configured correctly in Google Console
```

**Issue:** Port already in use
```bash
# Solution: Kill process using the port or use a different port
npx kill-port 3000
# or change PORT in .env file
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Inspiration:** ClickUp, Trello, Monday.com
- **Icons:** Lucide React
- **UI Framework:** Tailwind CSS
- **Charts:** Chart.js
- **Authentication:** Passport.js


## 📊 Project Statistics

![GitHub contributors](https://img.shields.io/github/contributors/your-username/capstone-project)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/capstone-project)
![GitHub issues](https://img.shields.io/github/issues/your-username/capstone-project)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/capstone-project)
![GitHub stars](https://img.shields.io/github/stars/your-username/capstone-project)

---

## 👥 Contributors

<p align="left">
<a href="https://github.com/EmmAI03"><img src="https://github.com/EmmAI03.png" width="80" height="80" style="border-radius: 50%;" alt="EmmAI03"/></a>
&nbsp;
<a href="https://github.com/fzikrii"><img src="https://github.com/fzikrii.png" width="80" height="80" style="border-radius: 50%;" alt="fzikrii"/></a>
&nbsp;
<a href="https://github.com/MannLTC19"><img src="https://github.com/MannLTC19.png" width="80" height="80" style="border-radius: 50%;" alt="MannLTC19"/></a>
&nbsp;
<a href="https://github.com/elmiraa89"><img src="https://github.com/elmiraa89.png" width="80" height="80" style="border-radius: 50%;" alt="elmiraa89"/></a>
</p>

---

## 📦 Main Dependencies

| Package          | Version  | Description                                                   |
|------------------|----------|---------------------------------------------------------------|
| @google/genai    | ^1.13.0  | Google client library for Gemini API                          |
| axios            | ^1.11.0  | Promise-based HTTP client                                     |
| chart.js         | ^4.5.0   | JavaScript charting library                                   |
| lucide-react     | ^0.532.0 | Icon library for React                                        |
| ogl              | ^1.0.11  | Lightweight WebGL library                                     |
| react            | ^19.1.0  | UI library                                                    |
| react-dom        | ^19.1.0  | React DOM renderer                                            |
| react-easy-crop  | ^5.5.0   | Image cropping for React                                      |
| react-router-dom | ^7.7.1   | Routing library for React                                     |
| tailwindcss      | ^4.1.11  | Utility-first CSS framework                                   |

---

## 🛠 Development Dependencies

| Package                      | Version   | Description                                      |
|------------------------------|-----------|--------------------------------------------------|
| @eslint/js                   | ^9.30.1   | ESLint core rules                                |
| @types/react                 | ^19.1.8   | TypeScript types for React                       |
| @types/react-dom             | ^19.1.6   | TypeScript types for React DOM                   |
| @vitejs/plugin-react         | ^4.6.0    | Official Vite plugin for React                   |
| eslint                       | ^9.30.1   | JavaScript linter                                |
| eslint-plugin-react-hooks    | ^5.2.0    | Enforce React Hooks rules                        |
| eslint-plugin-react-refresh  | ^0.4.20   | Validate React Refresh implementations           |
| globals                      | ^16.3.0   | Global identifiers for ESLint                    |
| vite                         | ^7.0.4    | Modern build tool & development server           |

---

**Made with ❤️ by the Capstone Team**
