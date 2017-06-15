#!/usr/bin/env node --harmony
const fs = require('fs');
const ini = require('ini');
const colors = require('colors/safe');
const open = require('open');

try {
    const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));
    if (!config) {
        console.log(colors.red('No Git repo found'));
        return;
    }

    var url = config['remote "origin"'].url;
    if (url.substring(0, 3) == "git") {
        url = url.substring(4);
        url = url.substring(0, url.length - 4);
        url = url.replace(':', '/');
        open(`http://${url}`);
    } else {
        open(url);
    }
} catch (e) {
    console.log(colors.red('No repo found!'));
}
