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
  const origins = child_process.execSync('git branch -a').toString().trim();
  const array = origins.split(/\r?\n/);
  const branches = array.map(item => item.trim());

  const remoteBranches = branches.filter(a => a.match(/remote/g));
  const localBranches = branches.filter(a => !a.match(/remote/g));

  const config = ini.parse(fs.readFileSync('.git/config', 'utf-8'));
  if (!config) {
    console.log(colors.red('No Git repo found'));
    return;
  }

  const url = urls.getHttpsUrlFromRemote(config['remote "origin"'].url);
  const branch = getCurrentBranch();

  if (branch === 'master') {
    open(url);
  } else {
    for (var i = 0; i < remoteBranches.length; i++) {
      const rb = remoteBranches[i];
      const regex = new RegExp(branch, 'g');
      if (rb.match(regex)) {
        open(`${url}/tree/${branch}`);
        process.exit();
      } else {
        open(url);
        process.exit();
      }
    }
  }
}

openRepo();
