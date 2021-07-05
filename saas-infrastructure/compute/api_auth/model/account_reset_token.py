from model.otp_token import OTPToken


class AccountResetToken(OTPToken):
    def __init__(self):
        super().__init__()
        self.sk = "TOKEN.RESET"
