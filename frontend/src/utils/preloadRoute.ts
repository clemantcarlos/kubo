export const preloadRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};
// TODO: NO SE HA UTILIZADO TODAVIA PERO SE PUEDE AGREGAR
// EXAMPLE
// <button
//   onMouseEnter={() => preloadRoute('/dashboard')}
//   onClick={() => navigate('/dashboard')}
// >
//   Ir al Dashboard
// </button>