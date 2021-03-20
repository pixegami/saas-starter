#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { SaasInfrastructureStack } from "../lib/saas-infrastructure-stack";
import ServiceProps from "../lib/utils/service-props";

// Configure all infrastructure things here.
const AWS_ACCOUNT: string = "535707483867";
const AWS_REGION: string = "us-east-1";
const serviceProps: ServiceProps = {
  serviceName: "SaasStarter",
  serviceRootDomain: "pixegami.com",
  serviceSubDomain: "ss",
  servicePrefix: "ss",
};

const app = new cdk.App();
new SaasInfrastructureStack(app, "SaasInfrastructureStack", serviceProps, {
  env: { account: AWS_ACCOUNT, region: AWS_REGION },
});
