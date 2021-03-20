import * as lambda from "@aws-cdk/aws-lambda";
import { RestApi } from "@aws-cdk/aws-apigateway";
import * as apigateway from "@aws-cdk/aws-apigateway";

export interface WrapWithApiProps {
  name: string;
  method: string[];
}

export const wrapWithApi = (
  lambdaFunction: lambda.IFunction,
  api: RestApi,
  props: WrapWithApiProps
) => {
  const crudApi = api.root.addResource(props.name);
  const crudIntegration = new apigateway.LambdaIntegration(lambdaFunction);
  props.method.forEach((methodName) => {
    crudApi.addMethod(methodName, crudIntegration, {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });
  });
  addCorsOptions(crudApi);
};

export const addCorsOptions = (apiResource: apigateway.IResource) => {
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
};
