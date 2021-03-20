import boto3
from typing import List


UTF8 = "UTF-8"


class EmailProps:
    def __init__(self):
        self.subject: str = "Untitled Email"
        self.source: str = ""
        self.text: str = ""
        self.html: str = ""
        self.reply_to: List[str] = []
        self.to_addresses: List[str] = []


class EmailSender:
    def __init__(self):
        pass

    def send_email(self, props: EmailProps):
        client = boto3.client("ses")
        client.send_email(
            Source=props.source,
            Destination={
                "ToAddresses": props.to_addresses,
                "CcAddresses": [],
                "BccAddresses": [],
            },
            Message={
                "Subject": {"Data": props.subject, "Charset": UTF8},
                "Body": {
                    "Text": {"Data": props.text, "Charset": UTF8},
                    "Html": {"Data": props.html, "Charset": UTF8},
                },
            },
            ReplyToAddresses=props.reply_to,
        )
