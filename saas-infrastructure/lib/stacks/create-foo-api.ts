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

const createFooApi = (
  scope: cdk.Construct,
  api: RestApi,
  apiEndpoint: string,
  layer: LayerVersion,
  serviceProps: ServiceProps
) => {
  const tableName: string = `${serviceProps.servicePrefix}.foo.items`;
  const endpoint: string = `https://${apiEndpoint}/foo`;
  const authEndpoint: string = `https://${apiEndpoint}/auth`;

  const table: ddb.Table = new ddb.Table(scope, "ServiceDataTable", {
    partitionKey: {
      name: "pk",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "type",
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
      name: "user_key",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "updated_time",
      type: ddb.AttributeType.NUMBER,
    },
  };

  const typeIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "type_index",
    partitionKey: {
      name: "type",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "updated_time",
      type: ddb.AttributeType.NUMBER,
    },
  };

  const compoundIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "compound_index",
    partitionKey: {
      name: "compound_key",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "updated_time",
      type: ddb.AttributeType.NUMBER,
    },
  };

  table.addGlobalSecondaryIndex(userIndex);
  table.addGlobalSecondaryIndex(typeIndex);
  table.addGlobalSecondaryIndex(compoundIndex);

  const apiProps: WrapWithApiProps = {
    name: "foo",
    method: ["POST", "GET"],
  };

  const functionProps: lambda.FunctionProps = {
    code: Code.fromAsset("compute/api_foo"),
    runtime: Runtime.PYTHON_3_7,
    timeout: Duration.seconds(10),
    layers: [layer],
    handler: "entry_point_handler.handler",
    memorySize: 256,
    environment: {
      TABLE_NAME: table.tableName,
      ENDPOINT: endpoint,
      AUTH_ENDPOINT: authEndpoint,
    },
  };

  const fooFunction = new lambda.Function(scope, apiProps.name, functionProps);
  wrapWithApi(fooFunction, api, apiProps);
  table.grantFullAccess(fooFunction);
};

export default createFooApi;
