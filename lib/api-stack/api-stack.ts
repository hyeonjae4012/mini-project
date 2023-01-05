import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const demoFunction = new lambda.Function(this, 'demoFunction', {
      code: lambda.Code.fromAsset('src/handler'),
      handler: 'app.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    
    const getFunction = new lambda.Function(this, 'getFunction', {
      code: lambda.Code.fromAsset('src/handler'),
      handler: 'getLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    const createFunction = new lambda.Function(this, 'createFunction', {
      code: lambda.Code.fromAsset('src/handler'),
      handler: 'upsertLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    const deleteFunction = new lambda.Function(this, 'deleteFunction', {
      code: lambda.Code.fromAsset('src/handler'),
      handler: 'deleteLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })

    const apiGw = new apigateway.RestApi(this, "hyeonjaeApiGW");

    const testResource = apiGw.root.addResource("test");
    testResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(demoFunction),
    );

    const testTable = new dynamodb.Table(this, "MyTestTable", {
      partitionKey: {
        name: "TestPartitionKey",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "MyTestTable",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })
  }
}
