import config from '../config';

/**
 * Utility function to determine if the API is available
 * Can be used to check connectivity or switch between APIs
 */
export const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('API is available');
      return true;
    }
    
    console.warn('API health check failed');
    return false;
  } catch (error) {
    console.error('API availability check error:', error);
    return false;
  }
};

/**
 * Get the appropriate API URL based on environment and availability
 */
export const getApiUrl = () => {
  // For now, always return the configured API URL
  // This function can be expanded later for more complex logic
  return config.API_BASE_URL;
};