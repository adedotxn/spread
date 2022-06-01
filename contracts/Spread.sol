///SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Spread {
    ERC20 private _token;
    uint256 public userCount;

    constructor(ERC20 token)  {
        _token = token;
    }

    function getbalance() public view returns(uint) {
        return _token.balanceOf(msg.sender);
    }

    function getTokenName() public view returns(string memory) {
        return _token.name();
    }

    function getTokenSymbol() public view returns(string memory) {
        return _token.symbol();
    }

    function setUserCount(uint _number) public {
        require(_number >= 2, "too short");
        userCount = _number;
    }

    function batchTransfer(address[] calldata addressesTo, uint256[] calldata amounts) external 
    returns (uint, bool)
    {
        require(addressesTo.length == amounts.length, "Invalid input parameters");

        uint256 sum = 0;
        for(uint256 i = 0; i < addressesTo.length; i++) {
            require(addressesTo[i] != address(0), "Invalid Address");
            require(amounts[i] != 0, "Invalid transfer amount");
            require(userCount >= 2, "Too short" );
            require(addressesTo.length <= userCount, "exceeds number of allowed addressess");
            require(amounts.length <= userCount, "exceeds number of allowed amounts");
            
            require(_token.transfer(addressesTo[i], amounts[i]* 10 ** 18), "Unable to transfer token to the account");
            sum += amounts[i];
        }
        return(sum, true);
    }

}