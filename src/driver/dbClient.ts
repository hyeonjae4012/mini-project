import * as AWS from "aws-sdk";
import {captureAWS} from "aws-xray-sdk-core";

export type DynamoDbSourceProps = {
  region?: string;
  endpoint?: string;
}

export type upsertDataParams = {
  TableName: string;
  Item: {
    [key: string]: string
  }
}

export type deleteDataParams = {
  TableName: string;
  Key: {
    [key: string]: string
  }
}

export type getDataParams = {
  TableName: string;
  Key: {
    [key: string]: string
  }
}

export class DynamoDBSource {
  DOC_CLIENT: AWS.DynamoDB.DocumentClient;

  constructor(props?: DynamoDbSourceProps) {
    const aws = captureAWS(AWS);

    this.DOC_CLIENT = new aws.DynamoDB.DocumentClient({
      region: props?.region ?? 'ap-northeast-1',
      endpoint: props?.endpoint ?? 'https://dynamodb.ap-northeast-1.amazonaws.com'
    })
  }

  async upsertOne(params: upsertDataParams){
    return this.DOC_CLIENT.put(params)
    .promise()
    .then((output) => {
      return output
    })
    .catch((err) => {
      console.error(err)
    });
  };

  async getOne(params: getDataParams){
    return this.DOC_CLIENT.get(params)
    .promise()
    .then((output) => {
      return output
    })
    .catch((err) => {
      console.error(err)
    });
  };

  async deleteOne(params: deleteDataParams){
    return this.DOC_CLIENT.delete(params)
    .promise()
    .then((output) => {
      return output
    })
    .catch((err) => {
      console.error(err)
    });
  };
}
