import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {

  const param = {
    TableName: 'MyTestTable',
    Key: event.param
  }

  const DOC_CLIENT = new DynamoDBSource();

  DOC_CLIENT.deleteOne(param)
}
