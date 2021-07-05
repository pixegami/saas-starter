from model.otp_token import OTPToken


class VerificationToken(OTPToken):
    def __init__(self):
        super().__init__()
        self.sk = "TOKEN.VERIFY"
