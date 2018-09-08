pragma solidity ^0.4.24;

import "./CCRCore.sol";

contract CCRCoreFactory {
    address public claimsRegistry;
    address[] internal ccrRegistry;

    event CCRPublished(address _ccrAddress, address indexed _publisher);

    constructor(address _claimsRegistry) public {
        claimsRegistry = _claimsRegistry;
    }

    function deployCCR(string _name, uint _quorum) public {
        CCRCore ccrCore = new CCRCore(claimsRegistry, _name, msg.sender, _quorum);
        ccrRegistry.push(ccrCore);
        emit CCRPublished(ccrCore, msg.sender);
    }

    function getRegistry() public view returns(address[]){
        return ccrRegistry;
    }
}