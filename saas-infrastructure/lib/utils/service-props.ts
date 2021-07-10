interface ServiceProps {
  serviceName: string;
  serviceRootDomain: string;
  servicePrefix: string;
  serviceFrontendUrl: string;
  region: string;
  stripeKey: string;
  stripePriceId: string;
}

export default ServiceProps;
