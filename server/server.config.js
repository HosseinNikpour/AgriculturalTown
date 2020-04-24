module.exports = {
  apps: [
    {
      name: 'My Awesome App',
      script: './server.js',
      instances: 0,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT
      }
    }
  ]
};