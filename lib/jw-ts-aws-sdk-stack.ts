import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class JwTsAwsSdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const FrontEndS3Bucket = new cdk.aws_s3.Bucket(this, "jw-frontend", {
			publicReadAccess: false,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			websiteIndexDocument: "index.html",
		});

		const originAccessIdentity =
			new cdk.aws_cloudfront.OriginAccessIdentity(this, "OriginAccess");

		// Grant read permissions to CloudFront
		FrontEndS3Bucket.addToResourcePolicy(
			new cdk.aws_iam.PolicyStatement({
				actions: ["s3:GetObject"],
				resources: [FrontEndS3Bucket.arnForObjects("*")],
				principals: [
					new cdk.aws_iam.CanonicalUserPrincipal(
						originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
					),
				],
			})
		);

		// Create CloudFront distribution
		const distribution = new cdk.aws_cloudfront.Distribution(
			this,
			"FrontEndDistribution",
			{
				defaultRootObject: "index.html",
				enabled: true,
				httpVersion: cdk.aws_cloudfront.HttpVersion.HTTP2,
				priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_100,
				defaultBehavior: {
					origin: origins.S3BucketOrigin.withOriginAccessIdentity(
						FrontEndS3Bucket,
						{
							originAccessIdentity: originAccessIdentity,
						}
					),
					compress: true,
					allowedMethods:
						cdk.aws_cloudfront.AllowedMethods
							.ALLOW_GET_HEAD_OPTIONS,
					viewerProtocolPolicy:
						cdk.aws_cloudfront.ViewerProtocolPolicy
							.REDIRECT_TO_HTTPS,
				},
				errorResponses: [
					{
						httpStatus: 403,
						responseHttpStatus: 200,
						responsePagePath: "/index.html",
					},
					{
						httpStatus: 404,
						responseHttpStatus: 200,
						responsePagePath: "/index.html",
					},
				],
			}
		);

		// Output the CloudFront URL
		new cdk.CfnOutput(this, "DistributionDomainName", {
			value: distribution.distributionDomainName,
			description: "CloudFront Distribution Domain Name",
		});

		// Output the S3 bucket name
		new cdk.CfnOutput(this, "BucketName", {
			value: FrontEndS3Bucket.bucketName,
			description: "S3 Bucket Name",
		});
	}
}
