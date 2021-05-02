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
    # Our email validator SES should automatically process the email.
    request_account_reset(user.upper(), 200)

    # Give SES time to process the email.
    time.sleep(7)
    sign_in(user, AUTO_RESET_PASSWORD)


def test_cannot_sign_with_invalid_email():
    user = "this@notEmail"
    password = generate_random_password()
    sign_up_test_user(user, password, 400)


def test_password_validator():

    user = generate_random_email()

    # Short password
    sign_up_test_user(user, "aB3", 400)

    # Weak password (no number)
    sign_up_test_user(user, "abcd", 400)

    # Weak password (no letters)
    sign_up_test_user(user, "1122", 400)

    # Long password
    long_password = "abcdABCD1234" * 6
    sign_up_test_user(user, long_password, 400)
