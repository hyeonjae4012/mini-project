import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as cloudfrontOrigin from 'aws-cdk-lib/aws-cloudfront-origins'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  	const appHostingBucket = new s3.Bucket(this, 'mini-project-app-source', {
      bucketName: 'mini-project-app-source',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  
		const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentity',
      {
        comment: 'app-distribution-originAccessIdentity',
      }
    );

    const appHostingBucketPolicyStatement = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.CanonicalUserPrincipal(
          originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [`${appHostingBucket.bucketArn}/*`]
    });
  
  	appHostingBucket.addToResourcePolicy(appHostingBucketPolicyStatement);

    const appHostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'app-hosted-zone', {
      zoneName: 'hyeonjae.classmethod.info',
      hostedZoneId: 'Z03752012Z1IYBYZA9WHQ',
    });

    const appCert = new acm.DnsValidatedCertificate(this, 'CrossRegionCertificate', {
      domainName: 'hyeonjae.classmethod.info',
      hostedZone: appHostedZone,
      region: 'us-east-1',
      validation: acm.CertificateValidation.fromDns(appHostedZone)
    });

		const distribution = new cloudfront.Distribution(this, 'distribution', {
			comment: 'app-distribution',
			defaultRootObject: 'index.html',
      domainNames: ['hyeonjae.classmethod.info'],
      certificate: appCert,
			defaultBehavior: {
				origin: new cloudfrontOrigin.S3Origin(appHostingBucket),
				allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			}
		})

    new route53.ARecord(this, 'app-distribution-record-route53', {
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone: appHostedZone,
    });
  }
}
