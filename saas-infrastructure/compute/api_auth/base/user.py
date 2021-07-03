import jwt
import time
import uuid
from api_utils import ApiItem


class User(ApiItem):

    TOKEN_DURATION_IN_HOURS = 24
    TOKEN_DURATION_SECONDS = TOKEN_DURATION_IN_HOURS * 3600

    def __init__(self):
        super().__init__()
        self.pk = uuid.uuid4().hex
        self.sk = "CREDENTIALS"
        self.email: str = ""
        self.hashed_password: str = ""
        self.verified: bool = False
        self.stripe_customer_id: str = ""
        self.membership_expiry_time: int = 0

    def serialize(self) -> dict:
        item = {
            "email": self.email,
            "hashed_password": self.hashed_password,
            "stripe_customer_id": self.stripe_customer_id,
            "verified": self.verified,
            "membership_expiry_time": self.membership_expiry_time,
        }
        item.update(self.basic_keys())
        return item

    def deserialize(self, item: dict) -> "User":
        self.pk = str(item.get("pk"))
        self.email = str(item.get("email"))
        self.hashed_password = str(item.get("hashed_password"))
        self.verified = bool(item.get("verified"))
        self.stripe_customer_id = str(item.get("stripe_customer_id"))
        self.membership_expiry_time = item.get("membership_expiry_time", None)
        return self

    def get_token(self, hash_key: str):
        token = jwt.encode(
            {
                "account_id": self.pk,
                "email": self.email,
                "exp": int(
                    time.time() + User.TOKEN_DURATION_SECONDS,
                ),
            },
            hash_key,
            algorithm="HS256",
        )
        return token

    # @staticmethod
    # def from_payload(payload: dict):
    #     return User(
    #         payload["pk"],
    #         payload["user"],
    #         payload["hashed_password"],
    #         payload["verified"],
    #         payload["expiry_time"] if "expiry_time" in payload else None,
    #     )