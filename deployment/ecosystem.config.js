module.exports = {
  apps: [{
    name: 'fleet-lms',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/fleet-lms',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_TELEMETRY_DISABLED: 1
    },
    error_file: '/var/www/fleet-lms/logs/err.log',
    out_file: '/var/www/fleet-lms/logs/out.log',
    log_file: '/var/www/fleet-lms/logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
