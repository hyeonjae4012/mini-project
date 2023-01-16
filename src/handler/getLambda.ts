import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);

  const param = {
    TableName: 'MyTestTable',
    Key: body
  }

  const DOC_CLIENT = new DynamoDBSource();

  await DOC_CLIENT.getOne(param)
}
