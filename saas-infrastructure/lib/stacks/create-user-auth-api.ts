import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import createAuthTable from "./tables/create_auth_table";
import { RestApi } from "@aws-cdk/aws-apigateway";
import { apiWithTable, ApiWithTableProps } from "../utils/api-commons";
import { LayerVersion } from "@aws-cdk/aws-lambda";
import ServiceProps from "../utils/service-props";

const createUserAuthApi = (
  scope: cdk.Construct,
  api: RestApi,
  layer: LayerVersion,
  serviceProps: ServiceProps
) => {
  const apiEndpoint = api.domainName?.domainName;
  const authEmailSource: string = `auth.${serviceProps.servicePrefix}@${serviceProps.serviceRootDomain}`;
  const authEndpoint: string = `https://${apiEndpoint}/auth`;
  const authTable: ddb.Table = createAuthTable(scope, serviceProps);
  const secret = new secretsmanager.Secret(scope, "AuthSecret");

  const authEnvironment = {
    TABLE_NAME: authTable.tableName,
    EMAIL_SOURCE: authEmailSource,
    ENDPOINT: authEndpoint,
    FRONTEND_URL: serviceProps.serviceFrontendUrl,
    SERVICE_NAME: serviceProps.serviceName,
    AUTH_SECRET: secret.secretValue.toString(),
    STRIPE_API_KEY: serviceProps.stripeKey,
    STRIPE_PRICE_ID: serviceProps.stripePriceId,
  };

  const authApiProps: ApiWithTableProps = {
    name: "auth",
    method: ["POST", "GET"],
    api: api,
    table: authTable,
    codePath: "compute/api_auth",
    handler: "auth_entrypoint.handler",
    environment: authEnvironment,
    layer: layer,
  };

  const stripeWebhookApiProps: ApiWithTableProps = {
    ...authApiProps,
    name: "stripe",
    handler: "payment.stripe_webhook_handler.handle",
  };

  apiWithTable(scope, authApiProps);
  apiWithTable(scope, stripeWebhookApiProps);
};

export default createUserAuthApi;
