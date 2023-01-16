import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {

  console.log(event)

  const param = {
    TableName: 'MyTestTable',
    Item: event.param
  }

  const DOC_CLIENT = new DynamoDBSource();

  await DOC_CLIENT.upsertOne(param)
}
