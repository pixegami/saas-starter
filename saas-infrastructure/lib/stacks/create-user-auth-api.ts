import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import { BillingMode } from "@aws-cdk/aws-dynamodb";
import { RestApi } from "@aws-cdk/aws-apigateway";
import { wrapWithApi, WrapWithApiProps } from "../utils/api-commons";
import { Code, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";
import { Duration } from "@aws-cdk/core";
import ServiceProps from "../utils/service-props";

const createUserAuthApi = (
  scope: cdk.Construct,
  api: RestApi,
  apiEndpoint: string,
  layer: LayerVersion,
  serviceProps: ServiceProps
) => {
  const tableName: string = `${serviceProps.servicePrefix}.user.auth`;
  const authEmailSource: string = `auth.${serviceProps.servicePrefix}@${serviceProps.serviceRootDomain}`;
  const authEndpoint: string = `https://${apiEndpoint}/auth`;

  const table: ddb.Table = new ddb.Table(scope, "AuthTable", {
    partitionKey: {
      name: "pk",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "sk",
      type: ddb.AttributeType.STRING,
    },
    timeToLiveAttribute: "expiry_time",
    tableName: tableName,
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const userIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "user_index",
    partitionKey: {
      name: "user",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "last_activity",
      type: ddb.AttributeType.NUMBER,
    },
  };

  const tokenIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "token_index",
    partitionKey: {
      name: "token",
      type: ddb.AttributeType.STRING,
    },
  };

  table.addGlobalSecondaryIndex(userIndex);
  table.addGlobalSecondaryIndex(tokenIndex);

  const authApiProps: AuthApiProps = {
    name: "auth",
    method: ["POST", "GET"],
    cmd: ["entry_point_handler.handler"],
    api: api,
    table: table,
    emailSource: authEmailSource,
    endpoint: authEndpoint,
    frontendUrl: serviceProps.serviceFrontendUrl,
  };

  // This will be used as hashing key for the JWT tokens.
  const secret = new secretsmanager.Secret(scope, "AuthSecret");

  const authFunctionProps: lambda.FunctionProps = {
    code: Code.fromAsset("compute/auth"),
    runtime: Runtime.PYTHON_3_7,
    timeout: Duration.seconds(10),
    handler: "entry_point_handler.handler",
    memorySize: 256,
    layers: [layer],
    environment: {
      TABLE_NAME: authApiProps.table.tableName,
      EMAIL_SOURCE: authApiProps.emailSource,
      ENDPOINT: authApiProps.endpoint,
      FRONTEND_URL: authApiProps.frontendUrl,
      AUTH_SECRET: secret.secretValue.toString(),
    },
  };

  const authFunction = new lambda.Function(
    scope,
    authApiProps.name,
    authFunctionProps
  );

  // Allows the function to send emails.
  const sendEmailStatement: iam.PolicyStatement = new iam.PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    effect: iam.Effect.ALLOW,
    resources: ["*"],
  });

  const stripeWebhookFunctionProps: lambda.FunctionProps = {
    code: Code.fromAsset("compute/auth"),
    runtime: Runtime.PYTHON_3_7,
    timeout: Duration.seconds(10),
    handler: "stripe_webhook_handler.handle",
    memorySize: 256,
    layers: [layer],
    environment: {
      TABLE_NAME: authApiProps.table.tableName,
      EMAIL_SOURCE: authApiProps.emailSource,
      ENDPOINT: authApiProps.endpoint,
      FRONTEND_URL: authApiProps.frontendUrl,
      AUTH_SECRET: secret.secretValue.toString(),
    },
  };

  const stripeFunction = new lambda.Function(
    scope,
    "stripe",
    stripeWebhookFunctionProps
  );

  authFunction.addToRolePolicy(sendEmailStatement);
  wrapWithApi(authFunction, authApiProps.api, authApiProps);
  authApiProps.table.grantFullAccess(authFunction);

  // Stripe API (HACKY!)
  stripeFunction.addToRolePolicy(sendEmailStatement);
  wrapWithApi(stripeFunction, authApiProps.api, {
    ...authApiProps,
    name: "stripe",
  });
  authApiProps.table.grantFullAccess(stripeFunction);
};

interface AuthApiProps extends WrapWithApiProps {
  cmd: string[];
  api: RestApi;
  table: ddb.Table;
  emailSource: string;
  endpoint: string;
  frontendUrl: string;
}

export default createUserAuthApi;
