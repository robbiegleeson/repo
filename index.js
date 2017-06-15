#!/usr/bin/env node --harmony
const fs = require('fs');
const ini = require('ini');
const colors = require('colors/safe');
const spawn = require('child_process').spawn

try {
    const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));
    if (!config) {
        console.log(colors.red('No Git repo found'));
        return;
    }
    spawn('open', [config['remote "origin"'].url]);
} catch (e) {
    console.log(colors.red('No repo found!'));
}
