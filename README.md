# AWS SPA Starter Kit with CDK

A starter template for building Single Page Applications (SPA) on AWS, featuring:

-   Vite for frontend development
-   TypeScript for type-safe code
-   AWS CDK for Infrastructure as Code
-   Automated deployments via GitHub Actions

## Project Structure

-   `/app` - Vite + TypeScript SPA
-   `/infra` - AWS CDK Infrastructure code
-   `.github/workflows` - CI/CD pipeline configurations

## Prerequisites

-   Node.js
-   AWS CLI configured
-   GitHub account (for deployments)

## Frontend Development

Navigate to the `/app` directory and run:

-   `npm install` install dependencies
-   `npm run dev` start development server
-   `npm run build` build for production
-   `npm run preview` preview production build locally

## Infrastructure Commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `npm run test` perform the jest unit tests
-   `npx cdk deploy` deploy this stack to your default AWS account/region
-   `npx cdk diff` compare deployed stack with current state
-   `npx cdk synth` emits the synthesized CloudFormation template

## Deployment

This project includes GitHub Actions workflows for automated deployments:

1. Infrastructure changes are deployed via CDK
2. Frontend code is built and deployed to AWS

For deployment setup, ensure your GitHub repository has the required AWS credentials configured as secrets.
