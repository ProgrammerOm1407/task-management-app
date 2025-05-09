# Deployment Instructions for Task Management App

## Backend Deployment (Render)

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Fix CORS configuration to allow Vercel frontend"
   git push
   ```

2. **Update Environment Variables on Render**:
   - Log in to your Render dashboard
   - Navigate to your task-management-app service
   - Go to the "Environment" tab
   - Add or update the following environment variables:
     - `NODE_ENV`: Set to `production`
     - `CORS_RESTRICTED`: Set to `false` initially (you can change to `true` later if needed)
   - Click "Save Changes"

3. **Trigger a Manual Deploy**:
   - Go to the "Manual Deploy" section
   - Select "Deploy latest commit" or "Clear build cache & deploy"
   - Wait for the deployment to complete

## Verifying the Deployment

1. **Test the API Health Endpoint**:
   - Open a browser and navigate to: `https://task-management-app-7gk3.onrender.com/health`
   - You should see a JSON response: `{"status":"ok","message":"Server is healthy"}`

2. **Test CORS Configuration**:
   - Run the test script locally:
     ```bash
     node test-cors.js
     ```
   - Open http://localhost:3030 in your browser
   - Click the "Test API Connection" button
   - If successful, you'll see a green success message

3. **Test with Your Frontend**:
   - Open your Vercel-deployed frontend: `https://taskmanagementapp-seven.vercel.app`
   - Try to register, login, and perform task operations
   - Check the browser console for any CORS errors

## Troubleshooting

If you still encounter CORS issues:

1. **Check the Network Tab**:
   - Open browser developer tools
   - Go to the Network tab
   - Look for requests to your Render API
   - Check if the preflight OPTIONS requests are successful

2. **Verify Headers**:
   - In the Network tab, select a request to your API
   - Check the Response Headers for:
     - `Access-Control-Allow-Origin`
     - `Access-Control-Allow-Methods`
     - `Access-Control-Allow-Headers`

3. **Try Disabling CORS Restriction**:
   - Set `CORS_RESTRICTED=false` in your Render environment variables
   - This will allow requests from any origin (less secure but useful for debugging)

4. **Check Render Logs**:
   - Go to your Render dashboard
   - Check the logs for any errors related to CORS

## Additional Notes

- The CORS configuration in `server.js` now includes your Vercel domain
- The `app.options('*', cors(corsOptions))` line explicitly handles preflight requests
- If you deploy to a different domain, update the `origin` array in the CORS configuration