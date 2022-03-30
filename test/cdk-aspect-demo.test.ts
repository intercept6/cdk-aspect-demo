import { BucketVersioningChecker } from '../lib/bucket-versioning-checker';
import { Template } from 'aws-cdk-lib/assertions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Aspects, App, Stack } from 'aws-cdk-lib';

describe('bucket versioning', () => {
  test('バージョニングが有効になっている', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', { versioned: true });

    Aspects.of(stack).add(new BucketVersioningChecker());

    const assembly = app.synth();
    const { messages } = assembly.getStackArtifact(stack.artifactId);

    expect(messages).toHaveLength(0);
  });

  test('バージョニングを有効にする', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', { versioned: false });

    Aspects.of(stack).add(new BucketVersioningChecker({ fix: true }));

    const assembly = app.synth();
    const { messages } = assembly.getStackArtifact(stack.artifactId);

    expect(messages).toHaveLength(0);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      Type: 'AWS::S3::Bucket',
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
      Properties: {
        VersioningConfiguration: {
          Status: 'Enabled',
        },
      },
    });
  });
});
