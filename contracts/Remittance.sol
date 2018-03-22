pragma solidity ^0.4.17;

contract Remittance {


    address public reciever;
    address public owner;
    bytes32 public passwd;
    uint256 public created_date;
    uint8 days_to_wait;
    event FundsUnlocked(address);
    event FundsReverted(address, uint256);

    function Remittance(address rec, bytes32 passwd_hash, uint8 days_available, address own) public payable {
        require(rec != 0);
        owner = own;
        reciever = rec;
        passwd = passwd_hash;
        created_date = now;
        days_to_wait = days_available;

    }
    
    modifier onlySender() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyReciever() {
        require(msg.sender == reciever);
        _;
    }

    function unlock(string pass) public onlyReciever {
        if (keccak256(pass) == passwd) {
            FundsUnlocked(msg.sender);
            reciever.transfer(this.balance);
        }
    }

    function redeem() public onlySender {
        require(now > created_date + days_to_wait * 1 days);
        FundsReverted(msg.sender, this.balance);
        owner.transfer(this.balance);
            

    }

}