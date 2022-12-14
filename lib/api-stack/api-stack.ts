import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // リソースの作成を別の Construct として分けるのが理想的
    // 別の Construct にした時に、別の Construct で作成されるリソースはどうやって参照する？
    // 例えば、API Gateway を作成する Construct で Lambda を作成する Construct 内の Lambda を参照するときに
    // sdk で持ってくる？違うと思う、、import することでできる、、？
    const demoFunction = new lambda.Function(this, 'demoFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/app.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    
    const getFunction = new lambda.Function(this, 'getFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/getLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    const upsertFunction = new lambda.Function(this, 'upsertFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/upsertLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })
    const deleteFunction = new lambda.Function(this, 'deleteFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/deleteLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X
    })

    const apiGw = new apigateway.RestApi(this, "hyeonjaeApiGW", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        statusCode: 200,
      },
    });

    const testResource = apiGw.root.addResource("test");
    testResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getFunction),
    );
    testResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(upsertFunction),
    );
    testResource.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(upsertFunction),
    );
    testResource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteFunction),
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
    });

    testTable.grantReadWriteData(getFunction);
    testTable.grantReadWriteData(upsertFunction);
    testTable.grantReadWriteData(deleteFunction);
  }
}
