# Thunder Client API Testing Guide

This guide will help you set up and use Thunder Client (VS Code Extension) to test your Task Management API.

## Setting Up Thunder Client

1. **Install Thunder Client Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Thunder Client"
   - Click "Install"

2. **Access Thunder Client**:
   - Click on the Thunder Client icon in the VS Code activity bar (left sidebar)
   - Or press Ctrl+Shift+P and type "Thunder Client"

## Creating a Collection

1. **Create a New Collection**:
   - Click on "Collections" in the Thunder Client sidebar
   - Click the "+" button to create a new collection
   - Name it "Task Management API"

2. **Set Environment Variables**:
   - Click on "Env" in the Thunder Client sidebar
   - Click the "+" button to create a new environment
   - Name it "Task Management"
   - Add the following variables:
     - `baseUrl`: `http://localhost:3000/api`
     - `authToken`: (leave empty for now)
     - `taskId`: (leave empty for now)

## Testing Authentication Endpoints

### Register a New User

1. **Create a New Request**:
   - In your collection, click the "+" button
   - Name it "Register User"
   - Set Method to "POST"
   - Set URL to `{{baseUrl}}/auth/register`

2. **Set Request Body**:
   - Click on the "Body" tab
   - Select "JSON" format
   - Enter:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }
     ```

3. **Add Test Script**:
   - Click on the "Tests" tab
   - Add the following script to save the token:
     ```js
     // Save auth token to environment
     if (response.status === 200 && response.body.token) {
       tc.setEnvVar("authToken", response.body.token);
     }
     ```

4. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with a token

### Login User

1. **Create a New Request**:
   - Name it "Login User"
   - Set Method to "POST"
   - Set URL to `{{baseUrl}}/auth/login`

2. **Set Request Body**:
   - Click on the "Body" tab
   - Select "JSON" format
   - Enter:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```

3. **Add Test Script**:
   - Click on the "Tests" tab
   - Add the following script to save the token:
     ```js
     // Save auth token to environment
     if (response.status === 200 && response.body.token) {
       tc.setEnvVar("authToken", response.body.token);
     }
     ```

4. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with a token

### Get User Profile

1. **Create a New Request**:
   - Name it "Get User Profile"
   - Set Method to "GET"
   - Set URL to `{{baseUrl}}/auth/me`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with user details

## Testing Task Endpoints

### Create a Task

1. **Create a New Request**:
   - Name it "Create Task"
   - Set Method to "POST"
   - Set URL to `{{baseUrl}}/tasks`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Set Request Body**:
   - Click on the "Body" tab
   - Select "JSON" format
   - Enter:
     ```json
     {
       "title": "Test Task",
       "description": "This is a test task",
       "status": "pending",
       "priority": "Medium",
       "dueDate": "2023-12-31"
     }
     ```

4. **Add Test Script**:
   - Click on the "Tests" tab
   - Add the following script to save the task ID:
     ```js
     // Save task ID to environment
     if (response.status === 201 && response.body.data && response.body.data._id) {
       tc.setEnvVar("taskId", response.body.data._id);
     }
     ```

5. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 201 Created response with the task details

### Get All Tasks

1. **Create a New Request**:
   - Name it "Get All Tasks"
   - Set Method to "GET"
   - Set URL to `{{baseUrl}}/tasks`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with an array of tasks

### Get Task by ID

1. **Create a New Request**:
   - Name it "Get Task by ID"
   - Set Method to "GET"
   - Set URL to `{{baseUrl}}/tasks/{{taskId}}`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with the task details

### Update a Task

1. **Create a New Request**:
   - Name it "Update Task"
   - Set Method to "PUT"
   - Set URL to `{{baseUrl}}/tasks/{{taskId}}`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Set Request Body**:
   - Click on the "Body" tab
   - Select "JSON" format
   - Enter:
     ```json
     {
       "status": "in-progress",
       "description": "Updated description"
     }
     ```

4. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with the updated task details

### Delete a Task

1. **Create a New Request**:
   - Name it "Delete Task"
   - Set Method to "DELETE"
   - Set URL to `{{baseUrl}}/tasks/{{taskId}}`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with a success message

## Testing Query Parameters

### Filter Tasks by Status

1. **Create a New Request**:
   - Name it "Get Tasks by Status"
   - Set Method to "GET"
   - Set URL to `{{baseUrl}}/tasks?status=pending`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with tasks filtered by status

### Filter Tasks by Priority

1. **Create a New Request**:
   - Name it "Get Tasks by Priority"
   - Set Method to "GET"
   - Set URL to `{{baseUrl}}/tasks?priority=High`

2. **Add Authentication Header**:
   - Click on the "Headers" tab
   - Add a new header:
     - Key: `x-auth-token`
     - Value: `{{authToken}}`

3. **Send the Request**:
   - Click "Send" to execute the request
   - You should receive a 200 OK response with tasks filtered by priority

## Troubleshooting Common Issues

### Authentication Issues

1. **Token Not Working**:
   - Check if the token has expired (default is 1 hour)
   - Re-run the login request to get a new token
   - Verify the token is being correctly set in the environment

2. **Registration Fails**:
   - Check if the email is already in use
   - Try using a different email address

### Database Connection Issues

1. **Server Returns 500 Errors**:
   - Check if MongoDB is running
   - Verify the MONGO_URI in your .env file
   - Check server logs for specific error messages

### Request Format Issues

1. **Validation Errors**:
   - Ensure all required fields are included in your requests
   - Check that field values match the expected formats and constraints
   - For tasks, ensure status is one of: 'pending', 'in-progress', 'completed'
   - For tasks, ensure priority is one of: 'Low', 'Medium', 'High'

## Exporting and Sharing Collections

1. **Export Collection**:
   - Right-click on your collection in Thunder Client
   - Select "Export"
   - Choose a location to save the collection file

2. **Import Collection**:
   - In Thunder Client, click on "Collections"
   - Click the menu (three dots) and select "Import"
   - Select your collection file

This allows you to share your API tests with team members or use them across different machines.