module.exports = {
  apps: [
    {
      name: 'fleet-management',
      script: './dist/server-secure.js',
      instances: 2, // Use 2 instances for load balancing
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Security and performance settings
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Process management
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // Advanced features
      instance_var: 'INSTANCE_ID',
      
      // Environment variables for security
      env_file: '.env',
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'root',
      host: '188.245.43.183',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/fleet-management.git',
      path: '/var/www/fleet.valtara.ai',
      'post-deploy': 'npm install && npm run build && npm run build:server && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get update && apt-get install -y git'
    }
  }
};
