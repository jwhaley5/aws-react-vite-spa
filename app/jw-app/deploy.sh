#!/bin/bash

source .env




# Set your variables
ROLE_ARN="arn:aws:iam::123456789012:role/MyDeployRole"  # Replace with your role ARN
BUCKET_NAME="my-vite-ui-bucket"  # Replace with your actual bucket name
PROFILE="default"  # AWS CLI profile (if needed)
BUILD_DIR="dist"  # Vite output directory

# Assume the role and capture credentials
echo "Assuming role..."
CREDENTIALS=$(aws sts assume-role --role-arn "$ROLE_ARN" --role-session-name ViteDeploySession --profile "$PROFILE" --output json)

# Extract temporary credentials
AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS | jq -r '.Credentials.AccessKeyId')
AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS | jq -r '.Credentials.SecretAccessKey')
AWS_SESSION_TOKEN=$(echo $CREDENTIALS | jq -r '.Credentials.SessionToken')

# Export credentials to the environment
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_SESSION_TOKEN

echo "Building Vite project..."
npm run build  # Ensure you have already installed dependencies (`npm install`)

# Sync build directory to S3
echo "Uploading to S3..."
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" --delete

# Unset temporary credentials
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN

echo "Deployment complete!"

