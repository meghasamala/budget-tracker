const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/index.js",
  "./js/idb.js"
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log(`installing cache : ${CACHE_NAME}`);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function(key)
            {return key.indexOf(APP_PREFIX)} 
            )
            cacheKeepList.push(CACHE_NAME)

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log(`deleting cache : ${keyList[i]}`);
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', function (event) {
    console.log(`fetch request : ${event.request.url}`);
    event.respondWith(
        caches.match(event.request).then(function (request) {
            if (request) {
                console.log(`responding with cache : ${event.request.url}`);
                return request;
            } else {
                console.log(`file is not cached, fetching : ${event.request.url}`);
                return fetch(event.request);
            }
        })
    )
})