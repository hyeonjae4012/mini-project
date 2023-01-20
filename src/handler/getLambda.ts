import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {

  const querystring = event.queryStringParameters;

  const param = {
    TableName: 'MyTestTable',
    Key: querystring
  }

  const DOC_CLIENT = new DynamoDBSource();

  const item = await DOC_CLIENT.getOne(param)

  return {
    statusCode: 200,
    body: item
  }
}
