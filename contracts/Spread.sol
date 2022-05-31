///SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NestcoinToken is ERC20 {
  address public _owner;

  string public coinName;
  string public coinSymbol;


  //minting the NXT token and assigning it to an owner(i.e the deployer)
  //the initial batch operator (i.e address that should run the batch transactions is set to the owner(i.e the deployer))
  constructor() ERC20(coinName, coinSymbol) {
        _mint(msg.sender, 30000000 * 10 ** 18);
        _owner = msg.sender;
    }

    //Function to run the batch transactions, return the success and sum of amounts [sent]
    function batchTransfer(address[] calldata addressesTo, uint256[] calldata amounts) external 
    returns (uint, bool)
    {
        require(addressesTo.length == amounts.length, "Invalid input parameters");

        uint256 sum = 0;
        for(uint256 i = 0; i < addressesTo.length; i++) {
            require(addressesTo[i] != address(0), "Invalid Address");
            require(amounts[i] != 0, "You cant't trasnfer 0 tokens");
            require(addressesTo.length <= 200, "exceeds number of allowed addressess");
            require(amounts.length <= 200, "exceeds number of allowed amounts");
            
            require(transfer(addressesTo[i], amounts[i]* 10 ** 18), "Unable to transfer token to the account");
            sum += amounts[i];
        }
        return(sum, true);
    }

    //Function to check the remainig token after distribution
    function checkTokenBalance() public view returns(uint256)  {
        return balanceOf(msg.sender);
    }

    //Function to for the current user to check their balance
    function userBalance() public view returns(uint256) {
        return balanceOf(msg.sender);
    }

}