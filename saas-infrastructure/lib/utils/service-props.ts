interface ServiceProps {
  serviceName: string;
  serviceRootDomain: string;
  serviceSubDomain: string | undefined;
  servicePrefix: string;
  serviceFrontendUrl: string;
  region: string;
}

export default ServiceProps;
