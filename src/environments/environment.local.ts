export const environment = {
  environment: 'local',
  production: false,
  base_url: 'http://localhost:8001',
  endpoints: {
    healthcheck: '/healthcheck',
    auth: '/authorization',
    user_info: '/user_info',
    reservations: '/reservations'
  }
};
