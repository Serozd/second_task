pragma solidity ^0.4.17;

import { Remittance } from './Remittance.sol';

contract RemittanceFactory {
	event RemittanceCreated(address reciever, address sender, address contr);
	function RemittanceFactory() public {

	}

	function deploy(address rec, bytes32 hash, uint8 days_available) public
			payable returns (address dest) { 
		Remittance inst = (new Remittance).value(msg.value)(rec, hash, days_available, msg.sender); 
		RemittanceCreated(rec, msg.sender, address(inst));
		return address(inst); 
	}



}