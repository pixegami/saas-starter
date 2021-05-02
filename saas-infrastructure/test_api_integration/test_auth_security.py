from utils import *

############################################
# Test authentication edge cases.
############################################


def test_sign_in_cooldown():

    # When I sign in fail too many times, I'm blocked for the next attempt.
    user = generate_random_email()
    password = generate_random_password()
    sign_up_test_user(user, password)

    # I can sign in 5 times before it locks.
    # But it MUST lock no later than after 10 times.
    attempts_before_locking = 3
    max_attempts_until_locking = 7

    for i in range(max_attempts_until_locking):
        time.sleep(0.1)  # We shouldn't really need to sleep, but just in case.

        if i < attempts_before_locking:
            # At this point, we expect it to fail sign-in attempt normally (wrong password).
            expected_code = 403
        elif i < max_attempts_until_locking - 1:
            # At this point, it can either fail or be on cooldown.
            expected_code = [403, 429]
        else:
            # At this point, it MUST be on cooldown.
            expected_code = 429

        print(f"Attempt #{i}")
        sign_in(user, generate_random_password(), expected_code)


def test_sign_in_cooldown_recovery():
    # After waiting long enough, I should be able to sign in again.
    user = generate_random_email()
    password = generate_random_password()
    sign_up_test_user(user, password)
    block_user_attempts(user)

    # Sign in and spoof 24h into the future.
    sign_in(user, password, 200)


def test_successful_sign_in_resets_cooldown():
    # After waiting long enough, I should be able to sign in again.
    user = generate_random_email()
    password = generate_random_password()
    sign_up_test_user(user, password)

    # Sign in a few times.
    for _ in range(3):
        sign_in(user, generate_random_password(), 403)

    # Sign in with the right password. Attempts should be reset.
    response = sign_in(user, password)
    print(response["data"])


def block_user_attempts(user):
    # Set the user's status to blocked with a cooldown.
    pass


# Need a way to spoof my sign-in time.
# Need response objects from the sign in?
# Need a way to instantly block a user?
