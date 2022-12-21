import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const demoFunction = new lambda.Function(this, 'demoFunction', {
      code: lambda.Code.fromAsset('src/handler'),
      handler: 'app.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
  }
}
