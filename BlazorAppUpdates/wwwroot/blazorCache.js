
window.blazorCache = {
    updateClient: function (url) {
        caches.open("blazor-cache-v3")
            .then(cache => {
                cache.delete(url)
                    .then(a => {
                        location.reload(true);
                    });
            });
    }
};