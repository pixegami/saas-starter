import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import { StaticSite } from "./stacks/static-site";
import createUserAuthApi from "./stacks/create-user-auth-api";
import ServiceProps from "./utils/service-props";
import createRestApi from "./stacks/create-rest-api";
import createEmailValidator from "./utils/create-email-validator";

export class SaasInfrastructureStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    serviceProps: ServiceProps,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Work out the domain names to use.
    const compositeDomainName = serviceProps.serviceSubDomain
      ? `${serviceProps.serviceSubDomain}.${serviceProps.serviceRootDomain}`
      : serviceProps.serviceRootDomain;
    const apiDomainName = `api.${compositeDomainName}`;

    // The main hosted zone.
    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: serviceProps.serviceRootDomain,
      privateZone: false,
    });

    // Create the main REST API Body.
    const api = createRestApi(this, apiDomainName, zone, serviceProps);
    createUserAuthApi(this, api, apiDomainName, serviceProps);

    // Create the email validator Lambda.
    createEmailValidator(this, serviceProps.servicePrefix);

    // Main static site front-end.
    new StaticSite(this, "MainSite", {
      domainName: serviceProps.serviceRootDomain,
      siteSubDomain: serviceProps.serviceSubDomain,
    });
  }
}
