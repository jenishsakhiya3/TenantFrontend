export const environment = {
  production: false,
  backendUrl: (window as any).__env?.backendUrl || 'http://localhost:3000'
};
