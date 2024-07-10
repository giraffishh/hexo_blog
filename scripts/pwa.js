hexo.extend.injector.register('head_begin', '<link rel="manifest" href="/manifest.json">', 'default');
hexo.extend.injector.register(
  'head_begin',
  `<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (confirm('New content is available; please refresh.')) {
                  window.location.reload();
                }
              }
            });
          });
        });
      });
    }
  </script>`,
  'default'
);