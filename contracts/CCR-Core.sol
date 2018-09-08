pragma solidity ^0.4.24;

import "./EthereumClaimsRegistry.sol";

contract CCRCore {
    EthereumClaimsRegistry public claimsRegistry;
    string public name;
    uint private quorum;

    bytes32 public constant valid = keccak256("true");
    bytes32 public constant invalid = keccak256("false");

    struct ClaimRace {
        address[] forClaim;
        address[] againstClaim;    
        bool pending;
        uint8 target;
    }

    mapping(address => mapping(string => ClaimRace)) private races;
    mapping(address => bool) private curators;

    event ClaimRaceRequested(address indexed _subject, string _claimTopic);
    event RaceConcluded(address indexed _subject, string _claimTopic, string _value);

    modifier onlyCurator() {
        require(curators[msg.sender] == true, "Not a curator");
        _;
    }

    constructor(address _registry, string _name, address _owner) public {
        name = _name;
        claimsRegistry = EthereumClaimsRegistry(_registry);
        curators[_owner] = true;
        quorum = 1;
    }

    function isCurator(address _subject) public view returns(bool) {
        return curators[_subject]; 
    }

    function requestClaimRace(string _claim) public {
        require(msg.sender != address(0), "Address invalid");
        require(races[msg.sender][_claim].pending == false, "Claim race is underway");
        races[msg.sender][_claim].pending = true;
    }

    function cancelClaimRace(string _claim) public{
        require(races[msg.sender][_claim].pending == true, "Race not active");
        delete races[msg.sender][_claim];
    }

    function checkClaim(address _subject, string _claim) public view {
        claimsRegistry.getClaim(address(this), _subject, keccak256(_claim));
    }

    function voteOnClaim(address _subject, string _claim, bool _support)  public onlyCurator {
        require(races[_subject][_claim].pending == true, "Claim race is not underway");
        if(_support) {
            races[_subject][_claim].forClaim.push(msg.sender);
            if(races[_subject][_claim].forClaim.length == quorum) {
                issueClaim(_subject, _claim, true);
            }
        } else {
            races[_subject][_claim].againstClaim.push(msg.sender);
            if(races[_subject][_claim].againstClaim.length == quorum) {
                issueClaim(_subject, _claim, false);
            }
        }
    }

    function issueClaim(address _subject, string _claim, bool _passed) internal {
        if(_passed){
            claimsRegistry.setClaim(_subject, keccak256(_claim), valid);
        } else {
            claimsRegistry.setClaim(_subject, keccak256(_claim), invalid);
        }
    }
     
}