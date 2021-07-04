import uuid
from api_utils import ApiItem


class VerificationToken(ApiItem):
    def __init__(self):
        super().__init__()
        self.pk = uuid.uuid4().hex
        self.sk = "TOKEN.VERIFY"
        self.token: str = ""

    def serialize(self) -> dict:
        item = {
            "token": self.token,
        }
        item.update(self.basic_keys())
        return item

    def deserialize(self, item: dict) -> "VerificationToken":
        self.pk = str(item.get("pk"))
        self.token = str(item.get("token"))
        return self
