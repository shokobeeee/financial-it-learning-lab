const CACHE_NAME = 'linux-kiban-lab-v21-evidence-and-boundaries';
const ASSETS = [
  "./integration-bridge.js?v=1",
  "../assets/js/component-rationale.js?v=2",
  "../assets/css/component-rationale.css?v=2",
  "../assets/js/foundation-glossary.js?v=1",
  "../assets/css/foundation-glossary.css?v=1",
  "./ui-financial-profiles.js?v=1",
  "./ui-financial-profiles.css?v=1",
  "./ui-compact.css?v=16",
  "./ui-live-terminal.css?v=16",
  "./ui-learning.css?v=16",
  "./ui-generic.css?v=16",
  "./ui-incident-modes.css?v=16",
  "./ui-incident-polish.css?v=16",
  "./ui-distro.css?v=16",
  "./ui-scope-context.css?v=16",
  "./ui-density.js?v=16",
  "./ui-learning.js?v=16",
  "./ui-generic.js?v=16",
  "./ui-incident-modes.js?v=16",
  "./ui-incident-polish.js?v=16",
  "./ui-distro.js?v=16",
  "./ui-scope-context.js?v=16",
  "./",
  "./README.txt",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./parrot_linux_lab01_web_nginx.html",
  "./parrot_linux_lab02_firewall_complete.html",
  "./parrot_linux_lab03_ip_dns.html",
  "./parrot_linux_lab04_ssh.html",
  "./parrot_linux_lab05_permissions.html",
  "./parrot_linux_lab06_process_memory.html",
  "./parrot_linux_lab07_storage_mount.html",
  "./parrot_linux_lab08_logs_troubleshooting.html",
  "./parrot_linux_lab09_apt_packages.html",
  "./parrot_linux_lab10_boot_kernel.html",
  "./parrot_linux_lab11_bash_pipes.html",
  "./parrot_linux_lab12_scheduler.html",
  "./parrot_linux_lab13_backup_restore.html",
  "./parrot_linux_lab14_containers.html",
  "./parrot_linux_lab15_tls_https.html",
  "./parrot_linux_lab16_monitoring.html",
  "./parrot_linux_lab17_ansible_iac.html",
  "./parrot_linux_lab18_virtualization_cloud.html",
  "./parrot_linux_lab19_security_hardening.html",
  "./parrot_linux_lab20_capstone.html",
  "./qa_review_report.html"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
