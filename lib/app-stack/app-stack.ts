import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam'

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appHostingBucket = new s3.Bucket(this, 'mini-project-app-source', {
        bucketName: 'mini-project-app-source',
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        websiteIndexDocument: 'index.html',
      });
  
  
      const appHostingBucketPolicyStatement = new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.AnyPrincipal
        ],
        resources: [`${appHostingBucket.bucketArn}/*`]
      });
  
      appHostingBucket.addToResourcePolicy(appHostingBucketPolicyStatement);
  }
}
