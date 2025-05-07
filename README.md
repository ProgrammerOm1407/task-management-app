# Task Management Application

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

### Backend Structure

```
task-management-app/
│── server.js           # Entry point for the backend
│── .env                # Environment variables (not tracked in git)
│── .env.example        # Example environment variables
│── package.json        # Project dependencies and scripts
│── models/             # Database models
│   ├── Task.js         # Task model schema
│   ├── User.js         # User model schema
│── controllers/        # Business logic
│   ├── taskController.js  # Task-related controller functions
│   ├── userController.js  # User-related controller functions
│── routes/             # API routes
│   ├── taskRoutes.js   # Task-related routes
│   ├── userRoutes.js   # User-related routes
│── config/             # Configuration files
│   ├── db.js           # Database connection setup
│── middleware/         # Custom middleware
│   ├── authMiddleware.js  # Authentication middleware
│── utils/              # Utility functions
│   ├── logger.js       # Logging utility
```

### Frontend Structure

```
client/
│── src/
│   ├── components/     # Reusable UI components
│   │   ├── TaskItem.js # Task item component
│   │   ├── Navbar.js   # Navigation bar component
│   ├── pages/          # Page components
│   │   ├── TaskPage.js # Task management page
│   ├── services/       # API service functions
│   │   ├── taskService.js # Task API service
│   ├── assets/         # Static assets like images
│   ├── styles/         # CSS stylesheets
│   │   ├── main.css    # Main stylesheet
│── public/             # Public static files
│   ├── index.html      # HTML entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your MongoDB URI and JWT secret
4. Install frontend dependencies:
   ```
   cd client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd client
   npm start
   ```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected route)

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS