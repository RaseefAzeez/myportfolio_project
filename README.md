# myportfolio_project

Here's a quick overview of the project:

This is a portfolio website hosted on AWS S3 as staic website which will get user data using a contact form (via API gateway) and process the event data via Lambda to store on DynamoDB, which will sent an even notification via SNS and lambda events are logged under Cloud Watch

CI/CD workflow has been implemented using GitHub Actions using S3 Sync to deploy the website on S3 (using static website hosting feature to lower the cost)
Granular IAM roles/ policies are assigned to appropriate resources including S3, API gateway, Lambda and DynamoDB.

In order perform Infrastructure as Code (IaC) for consistent deployments, useed AWS CloudFormation with GitSync feature enabled.


A Basic Structural architechture has been shared below:

![Structural Achitecture Digaram] (readme-images\structure-1.PNG)
