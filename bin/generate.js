#!/usr/bin/env node
import { generate } from '../index.js';

const commandArgs = process.argv.slice(2);
generate(commandArgs);
