import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ApiStack extends cdk.Stack {
  public readonly apiGw: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDBテーブルの作成
    const tripScheduleTable = new dynamodb.Table(this, "TripScheduleTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "day",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "TripScheduleTable",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 日付でクエリするためのGSI（Global Secondary Index）
    tripScheduleTable.addGlobalSecondaryIndex({
      indexName: "DayIndex",
      partitionKey: {
        name: "day",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Lambda関数の作成
    const getAllFunction = new lambda.Function(this, 'getAllFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/getAllLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
    });

    const getByDayFunction = new lambda.Function(this, 'getByDayFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/getByDayLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
    });

    const upsertFunction = new lambda.Function(this, 'upsertFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/upsertLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
    });

    const deleteFunction = new lambda.Function(this, 'deleteFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'handler/deleteLambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
    });

    // DynamoDBへのアクセス権限を付与
    tripScheduleTable.grantReadWriteData(getAllFunction);
    tripScheduleTable.grantReadWriteData(getByDayFunction);
    tripScheduleTable.grantReadWriteData(upsertFunction);
    tripScheduleTable.grantReadWriteData(deleteFunction);

    // API Gatewayの作成
    this.apiGw = new apigateway.RestApi(this, "TripScheduleApiGW", {
      restApiName: "Trip Schedule API",
      description: "API for managing trip schedule",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
      deployOptions: {
        tracingEnabled: true,
      }
    });

    const schedulesResource = this.apiGw.root.addResource("schedules");

    // 全件取得API: GET /schedules
    schedulesResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getAllFunction)
    );

    // 特定日付取得API: GET /schedules/{day}
    const dayResource = schedulesResource.addResource("{day}");
    dayResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getByDayFunction)
    );

    // 登録・修正API: POST /schedules, PUT /schedules
    schedulesResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(upsertFunction)
    );
    schedulesResource.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(upsertFunction)
    );

    // 削除API: DELETE /schedules/{id}/{day}
    const scheduleItemResource = schedulesResource.addResource("{id}").addResource("{day}");
    scheduleItemResource.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteFunction)
    );
  }
}
