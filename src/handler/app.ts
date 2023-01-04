export const handler = async (event: any) => {
  console.log(JSON.stringify(event))
      
  return {
      statuscode: 200,
      body: JSON.stringify('Hello from Lambda!'),
  }
}
