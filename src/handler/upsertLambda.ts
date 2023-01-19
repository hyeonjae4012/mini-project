import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);

  const param = {
    TableName: 'MyTestTable',
    Item: body
  }

  const DOC_CLIENT = new DynamoDBSource();

  const test = await DOC_CLIENT.upsertOne(param)
  console.log(test)
  return test
}
