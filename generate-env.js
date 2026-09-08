const fs = require('fs');

const envConfigFile = `(function (window) {
  window.__env = window.__env || {};
  window.__env.backendUrl = '${process.env.BACKEND_URL || 'http://localhost:3000'}';
})(this);
`;

// Usually in Azure, the app is served from the dist folder after a build.
// You can run this script as part of your startup command before serving the files.
const distPath = './dist/tenant-frontend/browser/env.js';
const publicPath = './public/env.js';

if (fs.existsSync('./dist/tenant-frontend/browser')) {
    fs.writeFileSync(distPath, envConfigFile);
    console.log(`Environment variables written to ${distPath}`);
} else {
    fs.writeFileSync(publicPath, envConfigFile);
    console.log(`Environment variables written to ${publicPath}`);
}
