#!/usr/bin/env node --harmony
const fs = require('fs');
const ini = require('ini');
const colors = require('colors/safe');
const open = require('open');
const child_process = require('child_process');
const request = require('request');

const urls = require('./urls');

const GET_CURRENT_BRANCH_CMD = 'git symbolic-ref -q --short HEAD';
const GET_CURRENT_TAG_CMD = 'git describe --tags --exact-match';

function execSync(cmd) {
  try {
    return child_process.execSync(cmd).toString().trim();
  } catch (err) {
    return '';
  }
}

function getCurrentBranch() {
  return execSync(GET_CURRENT_BRANCH_CMD) || execSync(GET_CURRENT_TAG_CMD);
}

function openRepo() {
  const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));
  if (!config) {
    console.log(colors.red('No Git repo found'));
    return;
  }

  const url = urls.getHttpsUrlFromRemote(config['remote "origin"'].url);
  const branch = getCurrentBranch();

  request.get(`${url}/tree/${branch}`)
    .on('response', function(response) {
      if (response.statusCode !== 404) {
        open(`${url}/tree/${branch}`);
      } else {
        open(url);
      }
    });
}

openRepo();
