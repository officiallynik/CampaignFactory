pragma solidity ^0.8.7;

contract CampaignFactory {
	mapping(address => string) public campaignDesc;
    address[] public deployedCampaigns;

    function createCampaign(string calldata desc, uint minimum) public {
        Campaign newCampaign = new Campaign(desc, minimum, msg.sender);
        campaignDesc[address(newCampaign)] = desc;
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getCampaignDescription(address campaignAddr) public view returns (string memory) {
        return campaignDesc[campaignAddr];
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    string public description;
    address public manager;
    uint public minimumContribution;
    Request[] public requests;
    uint public requestsCount;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(string memory desc, uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
        description = desc;
    }

    modifier managerRestricted () {
        require(msg.sender == manager);
        _;
    }

    function summary() public view returns (string memory, address, uint, uint, uint, uint) {
        return (
            description, 
            manager, 
            minimumContribution, 
            requests.length, 
            approversCount, 
            address(this).balance
        );
    }

    function contribute() public payable {
        if(msg.value >= minimumContribution) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(string memory desc, uint value, address recipient) 
        public managerRestricted {
        Request storage newRequest = requests.push();
        newRequest.description = desc;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        requestsCount++;
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);

        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable {
        Request storage request = requests[index];
        require(request.approvalCount > approversCount/2);
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}