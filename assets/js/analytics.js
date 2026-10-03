(function () {
    var OPT_OUT_KEY = 'cf_analytics_opt_out';
    var params = new URLSearchParams(window.location.search);

    // Visit once with ?analytics=off to stop counting this browser.
    // Visit with ?analytics=on to start counting again.
    if (params.get('analytics') === 'off') {
        try { localStorage.setItem(OPT_OUT_KEY, '1'); } catch (e) {}
    } else if (params.get('analytics') === 'on') {
        try { localStorage.removeItem(OPT_OUT_KEY); } catch (e) {}
    }

    var host = window.location.hostname;
    var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    var optedOut = false;
    try { optedOut = localStorage.getItem(OPT_OUT_KEY) === '1'; } catch (e) {}

    if (isLocal || optedOut) return;

    var token = window.CF_ANALYTICS_TOKEN;
    if (!token) return;

    var script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: token }));
    document.head.appendChild(script);
})();
