#!/usr/bin/env node --harmony
const fs = require('fs');
const ini = require('ini');
const colors = require('colors/safe');
const open = require('open');
const child_process = require('child_process');
const prompts = require('prompts');

const urls = require('./urls');

const GET_CURRENT_BRANCH_CMD = 'git symbolic-ref -q --short HEAD';
const GET_CURRENT_TAG_CMD = 'git describe --tags --exact-match';
const GET_ALL_BRANCGES = 'git branch -a';

const config = ini.parse(fs.readFileSync('.git/config', 'utf-8')) || null;

if (!config) {
  console.log(colors.red('No Git repo found'));
  return;
}

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

function getAllBranches() {
  let allBranches = child_process.execSync(GET_ALL_BRANCGES).toString().trim();
  allBranches = allBranches.split(/\r?\n/);
  return allBranches.map(item => item.trim());
}

function openRepo() {
  const branches = getAllBranches();

  const remoteBranches = branches.filter(a => a.match(/remote/g));

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
      }
    }
  }
}

async function getBranches() {
  console.log('made its')
  const remoteBranches = getAllBranches().filter(a => a.match(/remote/g));
  const url = urls.getHttpsUrlFromRemote(config['remote "origin"'].url);

  const response = await prompts([
    {
      type: 'select',
      name: 'branch',
      message: 'Select Branch',
      choices: remoteBranches.map((branch) => ({ title: branch, value: branch.replace('remotes/origin/', '') })),
    }
  ]);

  open(`${url}/tree/${response.branch}`);
  process.exit();
}

module.exports = { openRepo, getBranches };
