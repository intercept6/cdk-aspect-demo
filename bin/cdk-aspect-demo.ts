#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAspectDemoStack } from '../lib/cdk-aspect-demo-stack';
import * as lib from '../lib/bucket-versioning-checker';

const app = new cdk.App();
const cdkAspectDemoStack = new CdkAspectDemoStack(app, 'CdkAspectDemoStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

cdk.Aspects.of(cdkAspectDemoStack).add(new lib.BucketVersioningChecker());
