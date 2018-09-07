pragma solidity ^0.4.24;

contract CCRCore {
    address public claimsRegistry;
    string public name;
    uint private quorum;


    struct ClaimRace {
        bytes claimTopic;
        address[] forClaim;
        address[] againstClaim;    
        bool pending;
        uint8 target;
    }

    mapping(address => ClaimRace) private races;
    mapping(address => bool) private curators;

    event ClaimRaceRequested(address indexed _subject, string _claimTopic);
    event RaceConcluded(address indexed _subject, string _claimTopic, string _value);

    modifier onlyCurator() {
        require(curators[msg.sender] == true, "Not a curator");
        _;
    }

    constructor(address _registry, string _name, address _owner) public {
        name = _name;
        claimsRegistry = _registry;
        curators[_owner] = true;
        quorum = 1;
    }

    function isCurator(address _subject) public view returns(bool) {
        return curators[_subject]; 
    }

    function requestClaimRace(bytes _claim) public {
        require(msg.sender != address(0), "Address invalid");
        require(races[msg.sender].pending == false, "Claim race is underway");
        races[msg.sender].pending = true;
        races[msg.sender].claimTopic = _claim;
    }

    function cancelClaimRace() public{
        require(races[msg.sender].pending == true, "Race not active");
        delete races[msg.sender];
    }

    function voteOnClaim(address _subject, bytes _claim, bool _support)  public onlyCurator {
        require(races[_subject].pending == true, "Claim race is not underway");
        // require(races[_subject].claimTopic == _claim, "Claim mismatch");
    }
}