const axios = require('axios');

const LOGIN_SERVICE_URL = 'http://localhost:8080/auth/login';

exports.authenticateUser = async (nickname) => {
  try {
    const response = await axios.post(LOGIN_SERVICE_URL, { nickname });
    return response.data;
  } catch (error) {
    console.error('Error al autenticar usuario:', error.message);
    throw error;
  }
};
