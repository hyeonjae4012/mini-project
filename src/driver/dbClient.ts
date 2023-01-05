import * as AWS from 'aws-sdk';

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
    this.DOC_CLIENT = new AWS.DynamoDB.DocumentClient({
      region: props?.region ?? 'ap-northeast-1',
      endpoint: props?.endpoint ?? 'https://dynamodb.ap-northeast-1.amazonaws.com'
    })
  }

  async upsertOne(params: upsertDataParams){
    return this.DOC_CLIENT.put(params)
    .promise()
    .then((output) => {
      return output
    });
  };

  async getOne(params: getDataParams){
    return this.DOC_CLIENT.get(params)
    .promise()
    .then((output) => {
      return output
    });
  };

  async deleteOne(params: deleteDataParams){
    return this.DOC_CLIENT.delete(params)
    .promise()
    .then((output) => {
      return output
    });
  };
}
