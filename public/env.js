(function (window) {
  window.__env = window.__env || {};

  // Environment variables
  // In Azure App Service, a startup script should replace this value, or 
  // we can use a bash script to overwrite this file during deployment.
  window.__env.backendUrl = 'http://localhost:3000'; // Default
})(this);
