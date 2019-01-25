const filesToCache = [
    '/_framework/_bin/BlazorAppUpdates.dll',
    '/_framework/_bin/Microsoft.AspNetCore.Blazor.Browser.dll',
    '/_framework/_bin/Microsoft.AspNetCore.Blazor.dll',
    '/_framework/_bin/Microsoft.AspNetCore.Blazor.TagHelperWorkaround.dll',
    '/_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll',
    '/_framework/_bin/Microsoft.Extensions.DependencyInjection.dll',
    '/_framework/_bin/Microsoft.JSInterop.dll',
    '/_framework/_bin/Mono.WebAssembly.Interop.dll',
    '/_framework/_bin/mscorlib.dll',
    '/_framework/_bin/System.Core.dll',
    '/_framework/_bin/System.dll',
    '/_framework/_bin/System.Net.Http.dll',
    '/_framework/_bin/BlazorAppUpdates.pdb',
    '/_framework/_bin/BlazorAppUpdates.dll',
    '/_framework/wasm/mono.js',
    '/_framework/wasm/mono.wasm',
    '/_framework/blazor.boot.json',
    '/_framework/blazor.webassembly.js',
    '/css/bootstrap/bootstrap.min.css',
    '/css/open-iconic/font/css/open-iconic-bootstrap.min.css',
    '/css/site.css',
    '/favicon.ico',
    '/index.html',
    '/blazorCache.js',
    '/blazorSWRegister.js'
];

const staticCacheName = 'blazor-cache-v3';
const expectedCaches = [
    staticCacheName
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

// remove caches that aren't in expectedCaches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!expectedCaches.includes(key)) return caches.delete(key);
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)

                    .then(response => {
                        // TODO 5 - Respond with custom 404 page

                        if (response.ok) {
                            if (requestUrl.origin === location.origin) {

                                const pathname = requestUrl.pathname;
                                console.log("CACHE: Adding " + pathname);
                                return caches.open(staticCacheName).then(cache => {
                                    cache.put(event.request.url, response.clone());
                                    return response;
                                });
                            }
                            return response;
                        }
                    });
            }).catch(error => {

                // TODO 6 - Respond with custom offline page

            })
    );
});