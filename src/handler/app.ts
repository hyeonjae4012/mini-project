export const handler = async (event: any) => {
  console.log(JSON.stringify(event))
      
  return {
      isBase64Encoded: true,
      headers: {"testHeaderKey": "testHeaderValue"},
      statuscode: 200,
      body: 'Hello CDK',
  }
}
