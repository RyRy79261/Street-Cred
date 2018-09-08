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
        bool revoking;
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
    event ClaimRaceConcluded(address indexed _subject, string _claimTopic, bool _passed);

    event RevokeClaimRequested(address indexed _subject,  string _claimTopic);

    event CuratorApplication(address indexed _applicant);
    event CuratorApplicationConcluded(address indexed _applicant, bool _passed);

    modifier onlyCurator() {
        require(curators[msg.sender].validated == true, "Not a curator");
        _;
    }

    constructor(address _registry, string _name, address _publisher, uint _quorum) public {
        name = _name;
        claimsRegistry = EthereumClaimsRegistry(_registry);
        curators[_publisher].validated = true;
        quorum = _quorum;
        issueClaim(_publisher, "Curator", true);
    }

    function isCurator(address _subject) public view returns(bool) {
        return curators[_subject].validated; 
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

    function revokeClaim(string _claim) public {
        require(claimsRegistry.getClaim(address(this), msg.sender, keccak256(abi.encodePacked(_claim)))[0] != 0, "Claim not found in registry");
        races[msg.sender][_claim].pending = true;
        races[msg.sender][_claim].revoking = true;
        emit RevokeClaimRequested(msg.sender, _claim);
    }

   // Curator applications
   // To manually initiate a curator
    function addCurator(address _newCurator) public onlyCurator {
        require(curators[msg.sender].validated == false, "Already curator");
        require(curators[msg.sender].pending == false, "Vote already initiated"); 
        curators[msg.sender].pending = true;
        emit CuratorApplication(msg.sender);
        voteOnApplicant(_newCurator, true);
    }

    // To initiate a vote to become a curator 
    function joinCurators() public {
        require(curators[msg.sender].validated == false, "Already curator");
        require(curators[msg.sender].pending == false, "Vote already initiated"); 
        curators[msg.sender].pending = true;
        emit CuratorApplication(msg.sender);
    }

    // Can not cancel curator application as pending is not a blocker to any processes

    function initiateRevokeClaim(address _subject, string _claim) public onlyCurator {
        require(claimsRegistry.getClaim(address(this), _subject, keccak256(abi.encodePacked(_claim)))[0] != 0, "Claim not found in registry");
        require(races[_subject][_claim].pending = false, "Claim race is underway");
        races[_subject][_claim].pending = true;
        races[_subject][_claim].revoking = true;
        emit RevokeClaimRequested(_subject, _claim);
    }
    // Curators can vote validity of claims being issued
    function voteOnClaim(address _subject, string _claim, bool _support) public onlyCurator {
        require(races[_subject][_claim].pending == true, "Claim race is not underway");
        if(_support) {
            if(notVoted(races[_subject][_claim].votes.inFavor, msg.sender) == false){
                races[_subject][_claim].votes.inFavor.push(msg.sender);
                if(checkQuorum(races[_subject][_claim].votes.inFavor.length, curatorCount, quorum)) {
                    if(races[_subject][_claim].revoking) {
                        revokeClaim(_subject, _claim);
                        delete races[_subject][_claim];
                    }else{
                        issueClaim(_subject, _claim, true);
                        delete races[_subject][_claim];
                        emit ClaimRaceConcluded(_subject, _claim, true);
                    }
                }
            }
           
        } else {
            if(notVoted(races[_subject][_claim].votes.against, msg.sender) == false){
                races[_subject][_claim].votes.against.push(msg.sender);
                if(checkQuorum(races[_subject][_claim].votes.against.length, curatorCount, quorum)) {
                    issueClaim(_subject, _claim, true);
                    delete races[_subject][_claim];
                    emit ClaimRaceConcluded(_subject, _claim, false);
                }
            }
        }
    }

    // Voting on potential curators 
    function voteOnApplicant(address _subject, bool _support) public onlyCurator {
        require(curators[_subject].pending == true, "Application not initiated");
        // Leaving ability to vote good and bad, consequnce not present yet
        if(_support) {
            if(notVoted(curators[_subject].votes.inFavor, msg.sender) == false){
                curators[_subject].votes.inFavor.push(msg.sender);
                if(checkQuorum(curators[_subject].votes.inFavor.length, curatorCount, quorum)) {
                    issueClaim(_subject, "Curator", true);
                    curators[_subject].validated = true;
                    curators[_subject].pending = false;
                    curatorCount = curatorCount + 1;  // Probably dont need safe math, need to confirm
                    delete curators[_subject].votes;
                    emit CuratorApplicationConcluded(_subject, true);
                }
            }
        } else {
            if(notVoted(curators[_subject].votes.against, msg.sender) == false){
                curators[_subject].votes.against.push(msg.sender);
                if(checkQuorum(curators[_subject].votes.against.length, curatorCount, quorum)) {
                    issueClaim(_subject, "Curator", false);
                    curators[_subject].pending = false;
                    delete curators[_subject].votes;
                    emit CuratorApplicationConcluded(_subject, false);
                }
            }
        }
    }

    function checkQuorum(uint _votes, uint _voterCount, uint _quorum) internal pure returns(bool quorumReached) {
        quorumReached = (_voterCount/_quorum) + 1 <= _votes;
    }

    // Refactor probably
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
            claimsRegistry.setClaim(_subject, keccak256(abi.encodePacked(_claim)), valid);
        } else {
            claimsRegistry.setClaim(_subject, keccak256(abi.encodePacked(_claim)), invalid);
        }
    }

    function revokeClaim(address _subject, string _claim) internal {
        claimsRegistry.removeClaim(address(this), _subject, keccak256(abi.encodePacked(_claim)));
    }
}