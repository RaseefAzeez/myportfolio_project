const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// Environment variables
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN; // e.g., "https://example.com,https://dev.example.com"

exports.handler = async (event) => {
  let statusCode = 200;
  let body;

  // Determine request origin
  const requestOrigin = event.headers.origin || event.headers.Origin;
  const allowedOrigins = ALLOWED_ORIGIN.split(',');
  const originToAllow = allowedOrigins.includes(requestOrigin) ? requestOrigin : '';

  const defaultHeaders = {
    'Access-Control-Allow-Origin': originToAllow,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight CORS request
  if (event.httpMethod === 'OPTIONS') {
    console.log('Received OPTIONS request.');
    return {
      statusCode: 204,
      headers: defaultHeaders,
      body: '',
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      statusCode = 400;
      body = JSON.stringify({ message: 'Name, email, and message are required.' });
      return { statusCode, body, headers: defaultHeaders };
    }

    const submissionId = `submission-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const item = {
      submissionId,
      timestamp,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'N/A',
      message: formData.message,
      ipAddress: event.requestContext?.identity?.sourceIp || 'N/A'
    };

    // Save to DynamoDB
    await dynamodb.put({
      TableName: DYNAMODB_TABLE_NAME,
      Item: item
    }).promise();
    console.log('✔️ Saved to DynamoDB:', item);

    // Send SNS notification
    const snsMessage = `New Contact Form Submission:\n\n` +
      `Name: ${item.name}\n` +
      `Email: ${item.email}\n` +
      `Phone: ${item.phone}\n` +
      `Message: ${item.message}\n` +
      `Timestamp: ${item.timestamp}\n` +
      `Submission ID: ${item.submissionId}`;

    await sns.publish({
      Message: snsMessage,
      Subject: `New Portfolio Contact Form Submission (${item.name})`,
      TopicArn: SNS_TOPIC_ARN,
    }).promise();
    console.log('✔️ SNS notification sent.');

    body = JSON.stringify({ message: 'Form submitted successfully!', submissionId });

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    statusCode = 500;
    body = JSON.stringify({ message: 'Failed to submit form.', error: error.message });
  }

  return {
    statusCode,
    body,
    headers: defaultHeaders,
  };
};
