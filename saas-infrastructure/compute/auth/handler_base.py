import json
import os
import boto3
from handler_exception import HandlerException
from return_message import new_return_message


class HandlerBase:

    ENV_TABLE_NAME = "TABLE_NAME"

    def __init__(self):
        self.schema = {}

    def extract_json_body(self, event):
        return self.extract_json(event, "body")

    def extract_json(self, event, key: str):
        try:
            event_body = event[key]
            json_body = (
                json.loads(event_body) if type(event_body) is str else event_body
            )
        except Exception as e:
            raise HandlerException(400, f"Unable to parse JSON data of {key}: {e}")
        return json_body

    def extract_query_parameters(self, event):
        try:
            query_params = event["queryStringParameters"]
        except Exception as e:
            raise HandlerException(400, f"Unable to parse query params: {e}")
        return query_params

    def get_table(self, table_name: str):
        try:
            dynamodb = boto3.resource("dynamodb")
            table = dynamodb.Table(table_name)
            return table
        except Exception as e:
            raise HandlerException(500, f"Unable to connect to table: {e}")

    def get_default_table(self):
        try:
            table_name = os.environ[self.ENV_TABLE_NAME]
            return self.get_table(table_name)
        except Exception:
            raise HandlerException(500, f"Unspecified ENV_TABLE_NAME.")

    def handle(self, event, context=None):
        try:
            return self.with_request_validation(event, context)
        except HandlerException as e:
            return e.as_api_response()
        except Exception as e:
            return new_return_message(502, f"Unknown server error: {type(e)}: {e}")

    def with_request_validation(self, event, context):

        if "httpMethod" in event and event["httpMethod"].lower() == "get":
            request_data = self.extract_query_parameters(event)
        else:
            request_data = self.extract_json_body(event)

        for k, v in self.schema.items():
            if v is True and (request_data is None or k not in request_data):
                raise HandlerException(
                    400,
                    f"Invalid Request. Required key {k} not found in request body.",
                )
        return self.handle_action(request_data, event, context)

    def handle_action(self, request_data: dict, event: dict, context: dict):
        raise HandlerException(500, "Action not implemented.")