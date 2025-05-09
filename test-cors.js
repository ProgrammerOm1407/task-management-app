/**
 * Simple script to test CORS configuration
 * Run with: node test-cors.js
 */

const http = require('http');
const url = require('url');

// Create a simple server that simulates a frontend request
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/') {
    // Serve a simple HTML page with a fetch request to the API
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CORS Test</title>
      </head>
      <body>
        <h1>CORS Test</h1>
        <button id="testButton">Test API Connection</button>
        <div id="result" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc;"></div>
        
        <script>
          document.getElementById('testButton').addEventListener('click', async () => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Testing connection...';
            
            try {
              // Test the health endpoint
              const response = await fetch('https://task-management-app-7gk3.onrender.com/health', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Origin': 'https://taskmanagementapp-seven.vercel.app'
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                resultDiv.innerHTML = '<span style="color: green;">✓ Success!</span><br>Response: ' + 
                  JSON.stringify(data, null, 2);
              } else {
                resultDiv.innerHTML = '<span style="color: red;">✗ Error!</span><br>Status: ' + 
                  response.status + '<br>Text: ' + await response.text();
              }
            } catch (error) {
              resultDiv.innerHTML = '<span style="color: red;">✗ Error!</span><br>' + error.message;
              console.error('Error:', error);
            }
          });
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3030;
server.listen(PORT, () => {
  console.log(`CORS test server running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser and click the "Test API Connection" button');
});