const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const allowedOrigin =
    process.env.ALLOWED_ORIGIN ||
    "http://portfolio-dev-myportfoliocontents3bucket-061051251789.s3-website-us-east-1.amazonaws.com";

  console.log("🔹 Allowed Origin:", allowedOrigin);
  console.log("🔹 Incoming Event:", JSON.stringify(event));

  // ✅ Handle CORS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
      },
    };
  }

  try {
    const body = JSON.parse(event.body);
    const submissionId = Date.now().toString();

    // ✅ Store data in DynamoDB
    await dynamo
      .put({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          submissionId,
          timestamp: new Date().toISOString(),
          ...body,
        },
      })
      .promise();

    // ✅ Send SNS email notification
    await sns
      .publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: `New portfolio submission: ${JSON.stringify(body)}`,
      })
      .promise();

    console.log("✅ Data saved and SNS sent");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
      },
      body: JSON.stringify({
        message: "Form submitted successfully ✅",
      }),
    };
  } catch (error) {
    console.error("❌ Error submitting form:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
      },
      body: JSON.stringify({
        error: "Failed to process submission ❌",
      }),
    };
  }
};
