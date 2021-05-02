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
## S3 Bucket Redirect Rules

We need to add re-direct rules for client-only paths.

```json
[
    {
        "Condition": {
            "KeyPrefixEquals": "app"
        },
        "Redirect": {
            "HostName": "ss.pixegami.com",
            "HttpRedirectCode": "302",
            "Protocol": "https",
            "ReplaceKeyWith": "app/index.html"
        }
    }
]
```

## Adding Auto Email Validator

Once the email validator Lambda is deployed, you also need to add a rule in the SES console to write
emails to the correct bucket, and to invoke the appropriate Lambda function.

* The recipient should be whatever is specified in the `test_auth.py` integration tests' `VALIDATION_EMAIL`, 
e.g. `validated.pixegami.com`.
* Create an MX Record in Route53 for the domain name you want to use for the `VALIDATION_EMAIL`, so SES can receive it.
* (Action 1) The S3 bucket should be whatever was created by the `create-email-validator` function.
* (Action 2) The Lambda function should be the one created by `create-email-validator` function.
* Once you run the `test_auth.py` tests again, the tests requiring email validation should work.

## TODO

* Backend sends email on sign-up.
* Refactor names to be better.
* Salted hashes
* Implement email auto-validator stack.
* Case insensitive login.
* Valid emails.
* Backend validation. (strong passwords, email lengths).
* Meaningful error messages.
* 
* Login attempt cool-downs.
* 
* Consolidate configurations.
* Can MX record for the email be created by the stack?