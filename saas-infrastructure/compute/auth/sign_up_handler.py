from typing import List
from auth_handler_base import AuthHandlerBase, AuthUser
import bcrypt
import uuid
from create_stripe_customer import create_stripe_customer
from return_message import new_return_message
from request_account_verification_token import request_account_verification_token


class SignUpHandler(AuthHandlerBase):
    def __init__(self):
        super().__init__()
        self.schema = {"user": True, "password": True, "flags": False}

    def handle_action(self, request_data: dict, event: dict, context: dict):

        # Username/email should not be case sensitive.
        email = user = str(request_data["user"]).lower()
        password = request_data["password"]
        flags: List[str] = request_data["flags"] if "flags" in request_data else []

        # Validate at this user and password can be created.
        self.validator.email(user)
        self.validate_user_does_not_exist(user)
        self.validator.password(password)

        # Blah
        key = uuid.uuid4().hex
        hashed_password = bcrypt.hashpw(str.encode(password), salt=bcrypt.gensalt())
        hashed_password_str = hashed_password.decode("utf-8")

        # Be careful with security because users can game these flags.
        should_expire = "TMP" in flags
        should_verify = "AUTO_VERIFY" in flags
        should_be_member = "AUTO_MEMBER" in flags

        override_customer_id = None
        for flag in flags:
            if flag.startswith("OVERRIDE_CUSTOMER_ID"):
                override_customer_id = flag.split(":")[1]

        # Also create a Stripe customer to go with it.
        if override_customer_id:
            stripe_customer_id = override_customer_id
        else:
            stripe_customer_id = create_stripe_customer(key, user)

        self.put_user_credentials(
            key=key,
            user=user,
            hashed_password=hashed_password_str,
            stripe_customer_id=stripe_customer_id,
            should_expire=should_expire,
            should_verify=should_verify,
            should_be_member=should_be_member,
        )

        auth_user = AuthUser(key, user, hashed_password_str, should_verify)
        token = auth_user.get_token(self.JWT_HASH_KEY)
        response_payload = {"token": token}

        # Create verification token (if it's not auto-verified).
        if not should_verify:
            request_account_verification_token(self, email, key)

        return new_return_message(
            200,
            f"Successfully process sign-up request for {user} and {hashed_password_str}"
            f"and token {token}. "
            f"Should the user expire: {should_expire}",
            response_payload,
        )
