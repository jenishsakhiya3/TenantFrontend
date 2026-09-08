export const environment = {
  production: true,
  backendUrl: (window as any).__env?.backendUrl || 'http://localhost:3000'
};
