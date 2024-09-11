module.exports = {
  apps: [
    {
      name: "backoffice",
      script: "npm",
      args: "run start:docker",
      env: {
        PORT: 3001,
      },
      // Additional settings
      instances: 1, // Number of instances to run
      autorestart: true, // Automatically restart the app if it crashes
      watch: false, // Disable watching file changes
      max_restarts: 5, // Limit the number of restart attempts
      restart_delay: 1000, // Delay between restart attempts in milliseconds
      max_memory_restart: "300M", // Restart the app if it exceeds 300MB memory usage
    },
  ],
};
