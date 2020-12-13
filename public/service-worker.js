// const APP_PREFIX = 'BudgetTracker-';     
// const VERSION = 'version_01';
// const CACHE_NAME = APP_PREFIX + VERSION;
const CACHE_NAME = 'budget-tracker-cache';
const DATA_CACHE_NAME = 'budget-tracker-cache-v1';

const FILES_TO_CACHE = [
    //'/',
    '/index.html',
    '/js/index.js',
    '/css/styles.css',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
  ];

// Install service worker
self.addEventListener('install', function (evt) {
  evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
          console.log('Your files were pre-cached successfully!');
          return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', function(evt) {
 evt.waitUntil(
  caches.keys().then(keyList => {
       return Promise.all(
           keyList.map(key => {
               if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                   console.log('Delete old cache data if it exists', key); 
                   return caches.delete(key);
               }
           })
       )
      })
  );

 self.clients.claim();
});


// Intercept service worker
self.addEventListener('fetch', function (evt) {
  console.log('Performing fetch request: ' + evt.request.url)
  evt.respondWith(
    caches.match(evt.request).then(function (request) {
      if (request) { 
        console.log('responding with cache : ' + evt.request.url)
        return request
      } else {  
        console.log('file is not cached, fetching : ' + evt.request.url)
        return fetch(evt.request)
      }
    })
  )
})