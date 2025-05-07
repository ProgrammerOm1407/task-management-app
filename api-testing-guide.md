# API Testing Guide for Task Management App

This guide will help you test all the API endpoints using Postman or Thunder Client.

## Setup

1. **Install Postman** (recommended) from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
   - Or install Thunder Client as a VS Code extension

2. **Start the server**:
   ```
   npm start
   ```
   The server should be running on port 3000 (as specified in your .env file)

3. **Base URL**: `http://localhost:3000/api`

## Authentication Testing

### 1. Register a New User
- **Endpoint**: `POST /api/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 
  - Status: 200 OK
  - Body: Contains a JWT token

### 2. Login with User
- **Endpoint**: `POST /api/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 
  - Status: 200 OK
  - Body: Contains a JWT token

### 3. Get User Profile
- **Endpoint**: `GET /api/auth/me`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login]
- **Expected Response**: 
  - Status: 200 OK
  - Body: User details (without password)

## Task Management Testing

### 1. Create a New Task
- **Endpoint**: `POST /api/tasks`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login]
- **Body** (JSON):
  ```json
  {
    "title": "Test Task",
    "description": "This is a test task",
    "status": "pending",
    "priority": "Medium",
    "dueDate": "2023-12-31"
  }
  ```
- **Expected Response**: 
  - Status: 201 Created
  - Body: Contains the created task details

### 2. Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login] (optional - will filter by user if provided)
- **Expected Response**: 
  - Status: 200 OK
  - Body: Array of tasks

### 3. Get Task by ID
- **Endpoint**: `GET /api/tasks/:id`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login] (optional)
- **Expected Response**: 
  - Status: 200 OK
  - Body: Task details

### 4. Update a Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login]
- **Body** (JSON):
  ```json
  {
    "status": "in-progress",
    "description": "Updated description"
  }
  ```
- **Expected Response**: 
  - Status: 200 OK
  - Body: Updated task details

### 5. Delete a Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login]
- **Expected Response**: 
  - Status: 200 OK
  - Body: Success message

## Testing with Query Parameters

### Filter Tasks by Status
- **Endpoint**: `GET /api/tasks?status=pending`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login] (optional)
- **Expected Response**: 
  - Status: 200 OK
  - Body: Array of tasks with "pending" status

### Filter Tasks by Priority
- **Endpoint**: `GET /api/tasks?priority=High`
- **Headers**: 
  - `x-auth-token`: [Your JWT token from login] (optional)
- **Expected Response**: 
  - Status: 200 OK
  - Body: Array of tasks with "High" priority

## Common Issues and Troubleshooting

### 1. Database Connection Errors
- Check if MongoDB is running
- Verify the MONGO_URI in your .env file
- Make sure network connectivity is available if using MongoDB Atlas

### 2. Authentication Errors
- Ensure JWT_SECRET is properly set in .env
- Check if the token is being sent in the x-auth-token header
- Verify the token hasn't expired (default expiry is 1 hour)

### 3. Validation Errors
- Task status must be one of: 'pending', 'in-progress', 'completed'
- Task priority must be one of: 'Low', 'Medium', 'High'
- Task title is required
- User email must be unique

### 4. CORS Issues
- If testing from a frontend application on a different port, ensure CORS is properly configured
- The server already has CORS middleware enabled

## Automated Testing (Optional)

To set up automated testing with Jest and Supertest:

1. Install dependencies:
   ```
   npm install --save-dev jest supertest
   ```

2. Create test files in a `/tests` directory
3. Run tests with:
   ```
   npm test
   ```

Example test file structure:
```
/tests
  /auth
    register.test.js
    login.test.js
  /tasks
    createTask.test.js
    getTasks.test.js
    updateTask.test.js
    deleteTask.test.js
```