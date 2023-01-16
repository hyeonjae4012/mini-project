#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack/api-stack';
import { AppStack } from '../lib/app-stack/app-stack';

const app = new cdk.App();

const apiStack = new ApiStack(app, 'ApiStack');

new AppStack(app, 'AppStack', {
  apiGw: apiStack.apiGw
})
