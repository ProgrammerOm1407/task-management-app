# API Testing Guide for Task Management App

This guide provides instructions for testing the Task Management API using various methods.

## Prerequisites

- Node.js and npm installed
- MongoDB running (local or Atlas)
- Proper .env configuration (see .env.example)

## Starting the Server

```bash
npm start
```

The server will run on port 3000 by default (or as specified in your .env file).

## Testing Methods

### 1. Using Postman

1. **Install Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. **Import the Collection**:
   - Open Postman
   - Click "Import" button
   - Select the `task-management-api.postman_collection.json` file
3. **Set Environment Variables**:
   - Create a new environment
   - Add variables:
     - `authToken`: (leave empty, will be auto-filled)
     - `taskId`: (leave empty, will be auto-filled)
4. **Run the Requests** in the following order:
   - Register User or Login User
   - Create Task
   - Get All Tasks
   - Get Task by ID
   - Update Task
   - Delete Task

### 2. Using Thunder Client (VS Code Extension)

1. **Install Thunder Client** extension in VS Code
2. Follow the detailed instructions in `thunder-client-guide.md`

### 3. Using Automated Test Scripts

We've provided two test scripts:

- `test-api.js`: Tests the task CRUD operations
- `test-auth.js`: Tests the authentication flow

Run them individually:

```bash
node test-api.js
node test-auth.js
```

Or use our convenience scripts:

**Windows CMD**:
```
start-and-test.bat
```

**PowerShell**:
```
.\start-and-test.ps1
```

These scripts will:
1. Start the server
2. Run both test scripts
3. Allow you to stop the server when done

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
  - Returns: JWT token

- **Login**: `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns: JWT token

- **Get Profile**: `GET /api/auth/me`
  - Header: `x-auth-token: [your-jwt-token]`
  - Returns: User details

### Tasks

- **Create Task**: `POST /api/tasks`
  - Header: `x-auth-token: [your-jwt-token]`
  - Body: `{ "title": "...", "description": "...", "status": "...", "priority": "..." }`
  - Returns: Created task

- **Get All Tasks**: `GET /api/tasks`
  - Optional Header: `x-auth-token: [your-jwt-token]`
  - Optional Query Params: `status`, `priority`
  - Returns: Array of tasks

- **Get Task by ID**: `GET /api/tasks/:id`
  - Optional Header: `x-auth-token: [your-jwt-token]`
  - Returns: Task details

- **Update Task**: `PUT /api/tasks/:id`
  - Header: `x-auth-token: [your-jwt-token]`
  - Body: `{ "status": "...", "description": "..." }` (fields to update)
  - Returns: Updated task

- **Delete Task**: `DELETE /api/tasks/:id`
  - Header: `x-auth-token: [your-jwt-token]`
  - Returns: Success message

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check MongoDB connection string in .env
   - Ensure MongoDB is running
   - Check network connectivity for MongoDB Atlas

2. **Authentication Issues**:
   - Ensure JWT_SECRET is set in .env
   - Check if token is expired (default: 1 hour)
   - Verify token is being sent in x-auth-token header

3. **Validation Errors**:
   - Task status must be: 'pending', 'in-progress', 'completed'
   - Task priority must be: 'Low', 'Medium', 'High'
   - Task title is required
   - User email must be unique

4. **CORS Issues**:
   - If testing from a frontend on a different port, check CORS settings
   - The server has CORS middleware enabled by default

## Advanced Testing

For more advanced testing, consider:

1. **Writing Jest Tests**:
   ```bash
   npm install --save-dev jest supertest
   ```

2. **Setting up CI/CD Pipeline** with automated API tests

3. **Load Testing** with tools like Apache JMeter or Artillery