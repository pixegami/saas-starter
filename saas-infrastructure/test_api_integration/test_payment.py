from utils import *


def setup():
    pass


def test_create_payment_session():
    create_payment_session("price_1Ipw2ECCoJYujIqgPAGPkuYZ", 200)


def create_payment_session(
    pay_id: str, expected_status: Union[int, Set[int], None] = 200
):
    payload = {"price_id": pay_id}
    response = post_request(operation="create_payment_session", payload=payload)
    return assert_status(response, expected_status)
