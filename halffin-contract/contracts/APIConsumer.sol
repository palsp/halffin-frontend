// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    // minimum oracle payment otherwise request will not be accepted
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
    address private oracle;
    bytes32 private jobId;
    uint256 public games;
    string public slug;
    string public trackingNo;
    string public status;

    constructor() ConfirmedOwner(msg.sender) {
        setPublicChainlinkToken();
        oracle = 0xd47cA0e516acEBeD47bfBae2202Bf8a78f317ee3;
        jobId = "242c5d6a99a040de9b63cc3fd1a911a0";
        slug = "kerry-logistics";
        trackingNo = "SHP5107404116";
    }

    function requestTracking() external {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillTracking.selector
        );
        req.add("trackingNo", trackingNo);
        req.add("slug", slug);
        sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);
    }

    function fulfillTracking(bytes32 _requestId, bytes32 _tag)
        public
        recordChainlinkFulfillment(_requestId)
    {
        status = bytes32ToString(_tag);
    }

    function bytes32ToString(bytes32 _bytes32)
        public
        pure
        returns (string memory)
    {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}


curl -X POST -H "content-type:application/json" "https://2vkcicwaf1.execute-api.ap-southeast-1.amazonaws.com" --data '{"id" : 1, "data" : { "trackingNo" : "SHP5107404116" , "slug" : "kerry-logistics" }}'