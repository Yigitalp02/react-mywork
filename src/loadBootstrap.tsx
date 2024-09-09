// src/loadBootstrap.tsx
export const loadBootstrap = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
    document.head.appendChild(link);
  };
  