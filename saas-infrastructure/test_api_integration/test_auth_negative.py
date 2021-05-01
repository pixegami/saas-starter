from utils import *


def test_negative_sign_in():

    user = generate_random_email()
    password = generate_random_password()
    other_password = generate_random_password()
    sign_up(user, password, 200)

    # Sign-in should fail.
    sign_in(user, other_password, 403)
