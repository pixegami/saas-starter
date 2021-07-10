import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as route53 from "@aws-cdk/aws-route53";
import { Code, FunctionProps, Runtime } from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import { Duration } from "@aws-cdk/core";
import ServiceProps from "./service-props";

const createEmailValidator = (
  scope: cdk.Construct,
  apiEndpoint: string,
  hostedZone: route53.IHostedZone,
  serviceProps: ServiceProps
) => {
  // Create bucket to store the mail.
  const emailTestBucket = new s3.Bucket(scope, "EmailBucket", {
    bucketName: `${serviceProps.servicePrefix}.cloud.auth.email-validator`,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    lifecycleRules: [{ expiration: Duration.days(1) }],
  });

  // Lambda function to process the mail.
  const emailValidatorLambdaProps: FunctionProps = {
    runtime: Runtime.PYTHON_3_8,
    code: Code.fromAsset("compute/email_validator"),
    handler: "email_validator.handle",
    timeout: Duration.seconds(10),
    memorySize: 256,
    environment: {
      BUCKET: emailTestBucket.bucketName,
      API_ENDPOINT: apiEndpoint,
      FOLDER: "/tmp",
    },
  };

  const emailValidatorLambda = new lambda.Function(
    scope,
    "emailValidator",
    emailValidatorLambdaProps
  );

  // Grant permissions to SES.
  const sesServicePrinciple = new iam.ServicePrincipal("ses.amazonaws.com");
  emailTestBucket.grantRead(emailValidatorLambda);
  emailTestBucket.grantReadWrite(sesServicePrinciple);
  emailValidatorLambda.grantInvoke(sesServicePrinciple);

  // Create MX Record for the email validator.
  new route53.MxRecord(scope, "EmailReceiverRecord", {
    recordName: `auth.${serviceProps.serviceRootDomain}`,
    zone: hostedZone,
    values: [
      {
        hostName: `inbound-smtp.${serviceProps.region}.amazonaws.com`,
        priority: 10,
      },
    ],
  });
};

export default createEmailValidator;
