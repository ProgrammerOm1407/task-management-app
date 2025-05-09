# Task Management App - Testing Guide

This document provides instructions on how to run the tests for the Task Management App.

## Prerequisites

- Node.js installed
- MongoDB connection (configured in .env file)
- Server running on port 3000

## Important Notes

- Each test file uses a different test user to avoid conflicts:
  - test-api-new.js: Uses 'apitest@example.com'
  - test-auth-new.js: Uses 'authtest@example.com'
  - test-auth-middleware.js: Uses 'test@example.com'
  - debug-auth.js: Uses 'debug@example.com'

## Starting the Server

To start the server, run:

```bash
node server.js
```

## Running Tests

### Simple Server Test

To test if the server is running correctly:

```bash
node simple-test.js
```

### Authentication Tests

To test the authentication functionality:

```bash
node test-auth-new.js
```

This will test:
- User registration
- User login
- Protected routes
- User profile retrieval

### Auth Middleware Tests

To test the enhanced authentication middleware:

```bash
node test-auth-middleware.js
```

This will test:
- Authentication using x-auth-token header
- Authentication using Authorization Bearer header
- Authentication using query parameter
- Authentication using token in request body
- Handling of expired tokens
- Handling of malformed tokens
- Handling of tokens with invalid signatures
- Handling of completely invalid token formats

### API Tests

To test the task API endpoints:

```bash
node test-api-new.js
```

This will test:
- Authentication
- Getting all tasks
- Creating a task
- Getting a task by ID
- Updating a task
- Deleting a task
- Error handling

## Troubleshooting

If tests fail, check the following:

1. Make sure the server is running on port 3000
2. Check that MongoDB is connected
3. Verify that the .env file has the correct configuration:
   - PORT=3000
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret_key

### Authentication Issues

If you encounter authentication problems:

1. Run the debug-auth.js script to diagnose authentication issues:
   ```bash
   node debug-auth.js
   ```

2. Check the server logs for JWT errors
3. Verify that the test user exists in the database
4. Make sure the password is correct

## Notes

The original test files (test-api.js and test-auth.js) are deprecated. 
Please use the new versions (test-api-new.js and test-auth-new.js) instead.