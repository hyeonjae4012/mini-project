import { DynamoDBSource } from '../driver/dbClient'

export const handler = async (event: any) => {
  try {
    const day = event.pathParameters?.day;

    if (!day) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Day parameter is required'
        })
      };
    }

    const DOC_CLIENT = new DynamoDBSource();

    const param = {
      TableName: 'TripScheduleTable',
      IndexName: 'DayIndex',
      KeyConditionExpression: '#day = :day',
      ExpressionAttributeNames: {
        '#day': 'day'
      },
      ExpressionAttributeValues: {
        ':day': day
      }
    }

    const result = await DOC_CLIENT.queryByDay(param);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        items: result?.Items || []
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
};
