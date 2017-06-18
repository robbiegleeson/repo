const urls = require('../urls');

const testUrls = {
    ssh: [
        'ssh://git:foo@github.com/robbiegleeson/gistHub.git',
        'ssh://git@github.com/robbiegleeson/gistHub.git',
        'ssh://github.com/robbiegleeson/gistHub.git',

        'ssh://git:foo@github.com/robbiegleeson/gistHub',
        'ssh://git@github.com/robbiegleeson/gistHub',
        'ssh://github.com/robbiegleeson/gistHub',
    ],
    scp: [
        'git:foo@github.com:robbiegleeson/gistHub.git',
        'git@github.com:robbiegleeson/gistHub.git',

        'git:foo@github.com:robbiegleeson/gistHub',
        'git@github.com:robbiegleeson/gistHub',
    ],
    https: [
        'https://git:foo@github.com/robbiegleeson/gistHub.git',
        'https://git@github.com/robbiegleeson/gistHub.git',
        'https://github.com/robbiegleeson/gistHub.git',

        'https://git:foo@github.com/robbiegleeson/gistHub',
        'https://git@github.com/robbiegleeson/gistHub',
        'https://github.com/robbiegleeson/gistHub',
    ],
};

const expectedUrl = 'https://github.com/robbiegleeson/gistHub';

test('SSH URLs are identified correctly', () => {
  testUrls.ssh.forEach(url => {
      expect(urls.remoteIsSsh(url)).toBe(true)
      expect(urls.remoteIsScp(url)).toBe(false);
      expect(urls.remoteIsHttps(url)).toBe(false);
  });
});

test('SCP URLs are identified correctly', () => {
  testUrls.scp.forEach(url => {
      expect(urls.remoteIsSsh(url)).toBe(false)
      expect(urls.remoteIsScp(url)).toBe(true);
      expect(urls.remoteIsHttps(url)).toBe(false);
  });
});

test('HTTPS URLs are identified correctly', () => {
  testUrls.https.forEach(url => {
      expect(urls.remoteIsSsh(url)).toBe(false)
      expect(urls.remoteIsScp(url)).toBe(false);
      expect(urls.remoteIsHttps(url)).toBe(true);
  });
});

test('SSH URLs are transformed correctly', () => {
    testUrls.ssh.forEach(url => {
        expect(urls.getHttpsUrlFromSshRemote(url)).toBe(expectedUrl)
    });
});

test('SCP URLs are transformed correctly', () => {
    testUrls.scp.forEach(url => {
        expect(urls.getHttpsUrlFromScpRemote(url)).toBe(expectedUrl)
    });
});

test('HTTPS URLs are transformed correctly', () => {
    testUrls.https.forEach(url => {
        expect(urls.getHttpsUrlFromHttpsRemote(url)).toBe(expectedUrl)
    });
});

test('Unidentified URLs are transformed correctly', () => {
    const allTestUrls = Object.keys(testUrls)
        .reduce((urls, key) => urls.concat(testUrls[key]), []);

    allTestUrls.forEach(url => {
        expect(urls.getHttpsUrlFromRemote(url)).toBe(expectedUrl)
    });
});
