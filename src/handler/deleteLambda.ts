import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {

  const querystring = event.queryStringParameters;

  const param = {
    TableName: 'MyTestTable',
    Key: querystring
  }

  const DOC_CLIENT = new DynamoDBSource();

  const test = await DOC_CLIENT.deleteOne(param)
  console.log(test)
  return test
}
