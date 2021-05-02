from handler_exception import HandlerException


class AuthExceptions:

    # 403
    AUTH_FAILURE = HandlerException(403, "Incorrect password or email.")
    INVALID_TOKEN = HandlerException(
        403, "Authentication token is invalid or has expired. Please sign in again."
    )
    MISSING_HEADER = HandlerException(403, "Missing authentication header.")

    # 404

    USER_NOT_FOUND = HandlerException(404, "This email account does not exist.")
    KEY_NOT_FOUND = HandlerException(404, "Items key not found in database.")
    TOKEN_NOT_FOUND = HandlerException(
        404,
        "This token no longer or exists or has expired. Please request a new token.",
    )

    # 500

    DUPLICATE_ENTRIES_FOUND = HandlerException(
        500, "Unexpected duplicate entries were found for this key."
    )

    # 400

    INVALID_EMAIL = HandlerException(
        400, "This email is invalid. Please enter a valid email address."
    )
    USER_ALREADY_EXISTS = HandlerException(
        400, "This email account has already been registered."
    )

    # 429
    TOO_MANY_FAILED_ATTEMPTS = HandlerException(
        429,
        "Too many failed sign-in attempts. Please wait up to 24 hours before trying again.",
    )
