const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
// If you are not bundling 'uuid', you might comment out or remove this line for console testing.
// For production, ensure 'uuid' is part of your deployment package.
const { v4: uuidv4 } = require('uuid');

// Environment variables will be configured in the next step
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

exports.handler = async (event) => {
    let statusCode = 200;
    let body;

    // Define the standard headers for successful (and other) responses.
    // This 'headers' object *includes* 'Content-Type: application/json' for actual content responses.
    const defaultHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS', // Include all methods on API handles
        'Content-Type': 'application/json' // Essential for JSON responses
    };

    // --- Start: Refined OPTIONS method handling ---
    if (event.httpMethod === 'OPTIONS') {
        // For CORS preflight (OPTIONS method), return 204 No Content.
        // Critically, a 204 response should NOT have a Content-Type header in its response.
        console.log('Received OPTIONS request. Sending CORS preflight headers.');
        return {
            statusCode: 204, // HTTP 204 No Content status code
            headers: {
                'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
                'Access-Control-Allow-Methods': 'POST,OPTIONS', // Methods allowed for the actual request
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token' // Headers allowed in the actual request
                // Intentionally removed 'Content-Type' header for a 204 response
            },
            body: '' // An empty string body is appropriate for a 204 response
        };
    }
    // --- End: Refined OPTIONS method handling ---

    try {
        const formData = JSON.parse(event.body);

        // Basic server-side validation
        if (!formData.name || !formData.email || !formData.message) {
            statusCode = 400;
            body = JSON.stringify({ message: 'Name, email, and message are required.' });
            // Use defaultHeaders here as it's a content-bearing error response
            return { statusCode, body, headers: defaultHeaders };
        }

        // Use uuidv4 if bundled. Ensure 'uuid' is installed and deployed with Lambda.
        const submissionId = typeof uuidv4 === 'function' ? uuidv4() : `test-${Date.now()}`;
        const timestamp = new Date().toISOString();

        const item = {
            submissionId: submissionId,
            timestamp: timestamp,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'N/A', // Handle optional phone number
            message: formData.message,
            // Capture IP address if needed; ensure compliance with privacy laws (GDPR, etc.)
            ipAddress: event.requestContext && event.requestContext.identity ? event.requestContext.identity.sourceIp : 'N/A'
        };

        const dynamoParams = {
            TableName: DYNAMODB_TABLE_NAME,
            Item: item
        };
        await dynamodb.put(dynamoParams).promise();
        console.log('Successfully wrote to DynamoDB:', item);

        // Optional: Publish to SNS for notifications.
        // Ensure SNS_TOPIC_ARN is set as an environment variable and Lambda has sns:Publish permissions.
        const snsMessage = `New Contact Form Submission!\n\n` +
                           `Name: ${item.name}\n` +
                           `Email: ${item.email}\n` +
                           `Phone: ${item.phone}\n` +
                           `Message: ${item.message}\n` +
                           `Timestamp: ${item.timestamp}\n` +
                           `Submission ID: ${item.submissionId}`;

        const snsParams = {
            Message: snsMessage,
            Subject: `New Portfolio Contact Form Submission (${item.name})`,
            TopicArn: SNS_TOPIC_ARN
        };
        await sns.publish(snsParams).promise();
        console.log('Successfully published to SNS.');

        body = JSON.stringify({ message: 'Form submitted successfully!', submissionId: submissionId });

    } catch (error) {
        console.error('Error processing form submission:', error);
        statusCode = 500;
        body = JSON.stringify({ message: 'Failed to submit form.', error: error.message });
    } finally {
        // All non-OPTIONS responses (200, 400, 500) will use defaultHeaders which includes Content-Type.
        return { statusCode, body, headers: defaultHeaders };
    }
};