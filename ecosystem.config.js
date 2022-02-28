module.exports = {
  apps: [
    {
      name: "chrmc",
      script: "npm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      min_uptime: "10s",
      listen_timeout: 8000,
      max_memory_restart: "1G",
      env: {
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      }
    }
  ],
  deploy: {
    production: {
      user: "www",
      host: "37.77.106.193",
      ref: "origin/main",
      repo: "github:AlexXanderGrib/chrmc.fun.git",
      path: "/home/www/app",
      "post-deploy": "npm ci && npm run build && pm2 startOrRestart --env production",
      key: "./key.pem"
    }
  }
};
