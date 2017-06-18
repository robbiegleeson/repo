function remoteIsSsh(url) {
    return /^ssh:/.test(url);
}

function remoteIsScp(url) {
    return /^(?![^:]+:\/\/)[^@]*@/.test(url);
}

function remoteIsHttps(url) {
    return /^https:/.test(url);
}

function getHttpsUrlFromSshRemote(url) {
    return url.replace(/^ssh:\/\/([^@]*@)?(.+?)(\.git)?$/, 'https://$2');
}

function getHttpsUrlFromScpRemote(url) {
    return url.replace(/^([^@]*@)?([^:]+):?(.+?)(\.git)?$/, 'https://$2/$3');
}

function getHttpsUrlFromHttpsRemote(url) {
    return url.replace(/^https:\/\/([^@]*@)?(.+?)(\.git)?$/, 'https://$2');
}

function getHttpsUrlFromRemote(url) {
    if (remoteIsSsh(url)) {
        return getHttpsUrlFromSshRemote(url);
    } else if(remoteIsScp(url)) {
        return getHttpsUrlFromScpRemote(url);
    } else if (remoteIsHttps(url)) {
        return getHttpsUrlFromHttpsRemote(url);
    }

    return url;
}

module.exports = {
    remoteIsSsh,
    remoteIsScp,
    remoteIsHttps,
    getHttpsUrlFromSshRemote,
    getHttpsUrlFromScpRemote,
    getHttpsUrlFromHttpsRemote,
    getHttpsUrlFromRemote,
};
