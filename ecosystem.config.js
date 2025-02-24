module.exports = {
  apps : [{
    name   : "GymBuddy",
    script : "./dist/src/app.js", 
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
