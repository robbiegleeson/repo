#!/usr/bin/env node --harmony
const program = require('commander');
const repo = require('./options');

program
  .command('open')
  .description('Open repo on current branch.')
  .action(() => repo.openRepo());

program
  .command('branch')
  .description('Select branch to open.')
  .action(() => repo.getBranches());

program.parse(process.argv);