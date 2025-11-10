const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// Remove 'uuid' since we're running from console without npm modules.
// We'll use timestamp-based unique IDs instead.

// Environment variables
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

exports.handler = async (event) => {
    let statusCode = 200;
    let body;

    const defaultHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        console.log('Received OPTIONS request.');
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: ''
        };
    }

    try {
        const formData = JSON.parse(event.body);

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

        await dynamodb.put({
            TableName: DYNAMODB_TABLE_NAME,
            Item: item
        }).promise();
        console.log('✅ Saved to DynamoDB:', item);

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
            TopicArn: SNS_TOPIC_ARN
        }).promise();
        console.log('✅ SNS notification sent.');

        body = JSON.stringify({ message: 'Form submitted successfully!', submissionId });

    } catch (error) {
        console.error('❌ Error processing form submission:', error);
        statusCode = 500;
        body = JSON.stringify({ message: 'Failed to submit form.', error: error.message });
    } finally {
        return { statusCode, body, headers: defaultHeaders };
    }
};
