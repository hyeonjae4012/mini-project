import * as AWS from 'aws-sdk';

export const handler = async (event: any) => {

  const DOC_CLIENT = new AWS.DynamoDB.DocumentClient({
    region: 'ap-northeast-1',
    endpoint: 'https://dynamodb.ap-northeast-1.amazonaws.com'
  })

  const param = {
    TableName: 'MyTestTable',
    Key: event.param
  }

  return DOC_CLIENT.get(param)
    .promise()
    .then((output) => {
      return output
    })
}
