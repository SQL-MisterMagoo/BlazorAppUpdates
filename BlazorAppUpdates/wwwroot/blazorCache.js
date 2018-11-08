
window.blazorCache = {
    updateClient: function (url) {
        caches.open("blazor-cache-v1")
            .then(cache => {
                cache.delete(url)
                    .then(a => {
                        location.reload(true);
                    });
            });
    }
};