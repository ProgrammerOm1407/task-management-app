# CORS Issue Fix

## Problem

The frontend application hosted on Vercel (https://taskmanagementapp-seven.vercel.app) was unable to communicate with the backend API hosted on Render (https://task-management-app-7gk3.onrender.com) due to CORS restrictions.

## Solution

We've updated the CORS configuration in the backend server to allow requests from the Vercel-hosted frontend:

1. **Enhanced CORS Configuration**:
   - Added the Vercel domain to the list of allowed origins
   - Created a flexible configuration that can be controlled via environment variables
   - Added explicit handling for OPTIONS preflight requests

2. **Testing Tools**:
   - Created a test script (`test-cors.js`) to verify CORS configuration
   - Added detailed deployment instructions

## Changes Made

1. **Updated `server.js`**:
   - Replaced the simple CORS configuration with a more flexible one
   - Added support for different environments (development/production)
   - Added explicit handling for preflight requests
   - Added logging for CORS configuration

2. **Updated `.env.example`**:
   - Added a new environment variable `CORS_RESTRICTED` to control CORS behavior

3. **Created Testing and Deployment Resources**:
   - Added `test-cors.js` for local CORS testing
   - Created `deploy-instructions.md` with step-by-step deployment guide

## How to Verify

After deploying these changes to Render:

1. Open your Vercel-hosted frontend: https://taskmanagementapp-seven.vercel.app
2. Try to register, login, and perform task operations
3. Check the browser console - there should be no CORS errors

## Environment Variables

The CORS configuration now respects the following environment variables:

- `NODE_ENV`: Set to `production` in production environments
- `CORS_RESTRICTED`: 
  - Set to `true` to only allow specific origins
  - Set to `false` to allow requests from any origin (useful for debugging)

## Security Considerations

While the current configuration allows requests from specific origins, you may want to further restrict this in production:

1. Only include the exact domains you need in the `origin` array
2. Set `CORS_RESTRICTED=true` once everything is working correctly
3. Consider implementing additional security measures like rate limiting

## Additional Resources

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS middleware](https://expressjs.com/en/resources/middleware/cors.html)
- [CORS debugging guide](https://web.dev/cross-origin-resource-sharing/)