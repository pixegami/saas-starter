## Setup

### Docker Base Layer

You will need a base layer `.zip` file for the API stack's base Lambda layer. Follow instructions
in `compute/base_layer/Dockerfile` to create one.

## Testing

The Python files will test the API integration of the SaaS. Run it from the base directory:

```bash
python -m pytest -s test_api_integration/test_auth.py
```


## Outputs

```
SaasInfrastructureStack.ApiGateEndpoint8893369F = https://mzfoda4li8.execute-api.us-east-1.amazonaws.com/prod/
SaasInfrastructureStack.MainSiteBucket065D8D26 = ss.pixegami.com
SaasInfrastructureStack.MainSiteCertificateDFF4DA01 = arn:aws:acm:us-east-1:535707483867:certificate/1c75bfa0-26d3-4fe2-bae4-384c753df809
SaasInfrastructureStack.MainSiteDBB6B256 = https://ss.pixegami.com
SaasInfrastructureStack.MainSiteDistributionId2F6DCE80 = E4LY2JIIF7FSC
```
