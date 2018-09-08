pragma solidity ^0.4.24;

import "./EthereumClaimsRegistry.sol";

contract CCRCore {
    EthereumClaimsRegistry public claimsRegistry;
    string public name;
    uint private quorum;
    uint private curatorCount = 1;

    bytes32 public constant valid = keccak256("true");
    bytes32 public constant invalid = keccak256("false");

    struct Vote{
        address[] inFavor;
        address[] against;    
    }

    struct ClaimRace {
        Vote votes;  
        bool pending;
        uint8 target;
    }

    struct Curator{
        Vote votes;
        bool pending;
        bool validated;
    }

    mapping(address => mapping(string => ClaimRace)) private races;
    mapping(address => Curator) private curators;

    event ClaimRaceRequested(address indexed _subject, string _claimTopic);
    event RaceConcluded(address indexed _subject, string _claimTopic, bool _passed);

    event CuratorApplication(address indexed _applicant);
    event CuratorApplicationConcluded(address indexed _applicant, bool _passed);

    modifier onlyCurator() {
        require(curators[msg.sender].validated == true, "Not a curator");
        _;
    }

    constructor(address _registry, string _name, address _owner, uint _quorum) public {
        name = _name;
        claimsRegistry = EthereumClaimsRegistry(_registry);
        curators[_owner].validated = true;
        quorum = _quorum;
        issueClaim(_owner, "Curator", true);
    }

    function isCurator(address _subject) public view returns(bool) {
        return curators[_subject].validated; 
    }

     // Most likely too redundant 
    function checkClaim(address _subject, bytes32 _claim) public view {
        claimsRegistry.getClaim(address(this), _subject, _claim);
    }

    // Claim seekers
    function requestClaimRace(string _claim) public {
        require(msg.sender != address(0), "Address invalid");
        require(races[msg.sender][_claim].pending == false, "Claim race is underway");
        races[msg.sender][_claim].pending = true;
    }

    function cancelClaimRace(string _claim) public{
        require(races[msg.sender][_claim].pending == true, "Race not active");
        delete races[msg.sender][_claim];
    }

   // Curator applications
    function joinCurators() public {
        require(curators[msg.sender].validated == false, "Already curator");
        require(curators[msg.sender].pending == false, "Vote initiated"); 
        curators[msg.sender].pending = true;
        emit CuratorApplication(msg.sender);
    }

    function voteOnClaim(address _subject, string _claim, bool _support)  public onlyCurator {
        require(races[_subject][_claim].pending == true, "Claim race is not underway");
        if(_support) {
            if(notVoted(races[_subject][_claim].votes.inFavor, msg.sender) == false){
                races[_subject][_claim].votes.inFavor.push(msg.sender);
                if(checkQuorum(races[_subject][_claim].votes.inFavor.length)) {
                    issueClaim(_subject, _claim, true);
                }
            }
           
        } else {
            if(notVoted(races[_subject][_claim].votes.against, msg.sender) == false){
                races[_subject][_claim].votes.against.push(msg.sender);
                if(checkQuorum(races[_subject][_claim].votes.against.length)) {
                    issueClaim(_subject, _claim, true);
                }
            }
        }
    }

    function voteOnApplicant(address _subject, bool _support) public onlyCurator {
        require(curators[_subject].pending == true, "Application not initiated");
        // Leaving ability to vote good and bad, consequnce not present yet
        if(_support) {
            if(notVoted(curators[_subject].votes.inFavor, msg.sender) == false){
                curators[_subject].votes.inFavor.push(msg.sender);
                if(checkQuorum(curators[_subject].votes.inFavor.length)) {
                    issueClaim(_subject, "Curator", true);
                }
            }
           
        } else {
            if(notVoted(curators[_subject].votes.against, msg.sender) == false){
                curators[_subject].votes.against.push(msg.sender);
                if(checkQuorum(curators[_subject].votes.against.length)) {
                    issueClaim(_subject, "Curator", false);
                }
            }
        }
    }

    function checkQuorum(uint _votes) internal view returns(bool quorumReached) {
        quorumReached = (curatorCount/quorum) + 1 <= _votes;
    }

    // Refactor to hell
    function notVoted(address[] _list, address _target) internal pure returns(bool){
        for(uint i = 0; i < _list.length; i++){
            if(_target == _list[i]){
                return false;
            }
        }
        return true;
    }

    function issueClaim(address _subject, string _claim, bool _passed) internal {
        if(_passed){
            delete races[_subject][_claim];
            claimsRegistry.setClaim(_subject, keccak256(abi.encodePacked(_claim)), valid);
        } else {
            delete races[_subject][_claim];
            claimsRegistry.setClaim(_subject, keccak256(abi.encodePacked(_claim)), invalid);
        }
        emit RaceConcluded(_subject, _claim, _passed);
    }
}