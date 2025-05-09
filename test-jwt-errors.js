const jwt = require('jsonwebtoken');

// Test different JWT error scenarios
function testJwtErrors() {
  const secret = 'test_secret';
  
  console.log('=== Testing JWT Error Messages ===');
  
  // Test invalid signature
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwt.verify(token, secret);
  } catch (err) {
    console.log('Invalid signature error:');
    console.log('- Name:', err.name);
    console.log('- Message:', err.message);
  }
  
  // Test malformed token
  try {
    const token = 'invalid.token';
    jwt.verify(token, secret);
  } catch (err) {
    console.log('\nMalformed token error:');
    console.log('- Name:', err.name);
    console.log('- Message:', err.message);
  }
  
  // Test completely invalid token
  try {
    const token = 'not-a-token-at-all';
    jwt.verify(token, secret);
  } catch (err) {
    console.log('\nInvalid token error:');
    console.log('- Name:', err.name);
    console.log('- Message:', err.message);
  }
  
  console.log('\n=== JWT Error Testing Complete ===');
}

testJwtErrors();