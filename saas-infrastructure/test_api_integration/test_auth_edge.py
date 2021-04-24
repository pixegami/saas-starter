from utils import *

############################################
# Test authentication edge cases.
############################################


def test_sign_diff_case():
    # I can sign up and reset password with non-case-sensitive emails.
    user = generate_random_email(VALIDATION_EMAIL)
    password = generate_random_password()
    sign_up_test_user(user, password, 200)

    # Sign-in should succeed.
    sign_in(user.upper(), password, 200)

    # Request account reset with upper-case user name.
    request_account_reset(user.upper(), 200)

    # Give SES time to process the email.
    time.sleep(5)
    sign_in(user, AUTO_RESET_PASSWORD)
