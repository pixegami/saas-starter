from utils import *

############################################
# Test authentication edge cases.
############################################


def test_sign_up_diff_case():
    # I can sign up with non-case-sensitive emails.
    user = generate_random_email()
    password = generate_random_password()
    sign_up(user, password, 200)

    # Sign-in should succeed.
    sign_in(user.upper(), password, 200)
