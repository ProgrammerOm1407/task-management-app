
const http = require('http');

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  
  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received
  res.on('end', () => {
    console.log('RESPONSE:', data);
    process.exit(0);
  });
});

// Handle errors
req.on('error', (e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});

// End the request
req.end();

// Set a timeout to exit if no response is received
setTimeout(() => {
  console.error('Request timed out');
  process.exit(1);
}, 5000);