(function() {
  const API = 'https://admin.francegems.com/api/track';
  const data = {
    url: window.location.href,
    path: window.location.pathname,
    host: window.location.hostname,
    title: document.title,
    referrer: document.referrer || '',
    device: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  };
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
})();
