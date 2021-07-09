import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { BillingMode } from "@aws-cdk/aws-dynamodb";
import ServiceProps from "../../utils/service-props";

const createAuthTable = (scope: cdk.Construct, serviceProps: ServiceProps) => {
  const tableName: string = `${serviceProps.servicePrefix}.auth`;
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

  const emailIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "email_index",
    partitionKey: {
      name: "email",
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

  const stripeCustomerIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "stripe_customer_index",
    partitionKey: {
      name: "stripe_customer_id",
      type: ddb.AttributeType.STRING,
    },
  };

  table.addGlobalSecondaryIndex(emailIndex);
  table.addGlobalSecondaryIndex(tokenIndex);
  table.addGlobalSecondaryIndex(stripeCustomerIndex);
  return table;
};

export default createAuthTable;
