import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {

  console.log(event)

  const body = JSON.parse(event.body);

  const param = {
    TableName: 'MyTestTable',
    Key: body
  }

  const DOC_CLIENT = new DynamoDBSource();

  return await DOC_CLIENT.getOne(param)
}
