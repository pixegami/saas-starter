import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as lambda from "@aws-cdk/aws-lambda";
import { StaticSite } from "./stacks/static-site";
import createUserAuthApi from "./stacks/create-user-auth-api";
import ServiceProps from "./utils/service-props";
import createRestApi from "./utils/create-rest-api";
import createEmailValidator from "./utils/create-email-validator";
import createFooApi from "./stacks/create-foo-api";

export class SaasInfrastructureStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    serviceProps: ServiceProps,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Work out the domain names to use.
    const apiDomainName = `api.${serviceProps.serviceRootDomain}`;

    // The main hosted zone.
    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: serviceProps.serviceRootDomain,
      privateZone: false,
    });

    // Create common Lambda layer.
    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("compute/base_layer/layer.zip"),
      compatibleRuntimes: [
        lambda.Runtime.PYTHON_3_8,
        lambda.Runtime.PYTHON_3_7,
      ],
      license: "Apache-2.0",
      description: "A layer with bcrypt and authentication.",
    });

    const api = createRestApi(this, apiDomainName, zone, serviceProps);
    createUserAuthApi(this, api, layer, serviceProps);
    createFooApi(this, api, layer, serviceProps);
    createEmailValidator(this, apiDomainName, zone, serviceProps);

    // Main static site front-end.
    new StaticSite(this, "MainSite", {
      domainName: serviceProps.serviceRootDomain,
    });
  }
}
