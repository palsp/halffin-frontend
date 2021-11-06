from brownie import config, network, Oracle
from scripts.helpful_scripts import get_account


def set_fulfillment_permission():
    account = get_account()
    oracle = Oracle[-1]
    node_address = config["networks"][network.show_active()]["chainlink_node"]
    oracle.setFulfillmentPermission(node_address, True, {"from": account})


def main():
    print(f"oracle contract deployed at {Oracle[-1].address}")
    set_fulfillment_permission()
