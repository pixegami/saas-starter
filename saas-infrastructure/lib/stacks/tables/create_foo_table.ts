import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { BillingMode } from "@aws-cdk/aws-dynamodb";
import ServiceProps from "../../utils/service-props";

const createFooTable = (scope: cdk.Construct, serviceProps: ServiceProps) => {
  const tableName: string = `${serviceProps.servicePrefix}.foo`;
  const table: ddb.Table = new ddb.Table(scope, "ServiceDataTable", {
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
    indexName: "account_index",
    partitionKey: {
      name: "account_id",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "updated_time",
      type: ddb.AttributeType.NUMBER,
    },
  };

  const typeIndex: ddb.GlobalSecondaryIndexProps = {
    indexName: "sk_index",
    partitionKey: {
      name: "sk",
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
  return table;
};

export default createFooTable;
