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
- `GET /api/tasks/:id` - Get a single task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected route)

## Testing the API with Postman

### Setting Up Postman
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection named "Task Management API"

### Testing Task Endpoints

#### 1. Get All Tasks
- **Method**: GET
- **URL**: `http://localhost:5000/api/tasks`
- **Expected Response**: 
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Complete project",
        "description": "Finish the task management app",
        "status": "in-progress",
        "priority": "High",
        "dueDate": "2023-06-30T00:00:00.000Z",
        "createdAt": "2023-06-22T10:30:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "title": "Learn React",
        "description": "Study React hooks and context API",
        "status": "pending",
        "priority": "Medium",
        "createdAt": "2023-06-21T15:45:00.000Z"
      }
    ]
  }
  ```

#### 2. Create a New Task
- **Method**: POST
- **URL**: `http://localhost:5000/api/tasks`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "title": "Learn Node.js",
    "description": "Study Express and MongoDB integration",
    "status": "pending",
    "priority": "High",
    "dueDate": "2023-07-15T00:00:00.000Z"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Learn Node.js",
      "description": "Study Express and MongoDB integration",
      "status": "pending",
      "priority": "High",
      "dueDate": "2023-07-15T00:00:00.000Z",
      "createdAt": "2023-06-23T09:15:00.000Z"
    },
    "message": "Task created successfully"
  }
  ```

#### 3. Get a Single Task
- **Method**: GET
- **URL**: `http://localhost:5000/api/tasks/60d21b4667d0d8992e610c87`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Learn Node.js",
      "description": "Study Express and MongoDB integration",
      "status": "pending",
      "priority": "High",
      "dueDate": "2023-07-15T00:00:00.000Z",
      "createdAt": "2023-06-23T09:15:00.000Z"
    }
  }
  ```

#### 4. Update a Task
- **Method**: PUT
- **URL**: `http://localhost:5000/api/tasks/60d21b4667d0d8992e610c87`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "status": "in-progress",
    "description": "Study Express, MongoDB integration, and authentication"
  }
  ```
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Learn Node.js",
      "description": "Study Express, MongoDB integration, and authentication",
      "status": "in-progress",
      "priority": "High",
      "dueDate": "2023-07-15T00:00:00.000Z",
      "createdAt": "2023-06-23T09:15:00.000Z"
    },
    "message": "Task updated successfully"
  }
  ```

#### 5. Delete a Task
- **Method**: DELETE
- **URL**: `http://localhost:5000/api/tasks/60d21b4667d0d8992e610c87`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Task deleted successfully"
  }
  ```

### Testing Error Handling

#### 1. Create Task with Missing Title
- **Method**: POST
- **URL**: `http://localhost:5000/api/tasks`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "description": "This task has no title",
    "status": "pending"
  }
  ```
- **Expected Response** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "Validation Error",
    "message": "Title is required"
  }
  ```

#### 2. Update Non-existent Task
- **Method**: PUT
- **URL**: `http://localhost:5000/api/tasks/60d21b4667d0d8992e610c99`
- **Headers**: 
  - Content-Type: application/json
- **Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Expected Response** (404 Not Found):
  ```json
  {
    "success": false,
    "error": "Not Found",
    "message": "Task not found"
  }
  ```

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS