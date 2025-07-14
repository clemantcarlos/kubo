export const preloadRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};
// EXAMPLE
// <button
//   onMouseEnter={() => preloadRoute('/dashboard')}
//   onClick={() => navigate('/dashboard')}
// >
//   Ir al Dashboard
// </button>