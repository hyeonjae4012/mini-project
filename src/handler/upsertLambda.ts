import { DynamoDBSource } from '../driver/dbClient'
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    // idが存在しない場合は新規作成（UUIDを生成）
    if (!body.id) {
      body.id = uuidv4();
    }

    const param = {
      TableName: 'TripScheduleTable',
      Item: body
    }

    const DOC_CLIENT = new DynamoDBSource();

    await DOC_CLIENT.upsertOne(param);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        message: 'Schedule saved successfully',
        item: body
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error'
      })
    };
  }
}
