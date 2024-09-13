

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WeatherHedge is ERC1155, ERC1155Burnable {
    uint public constant NFT_0 = 0;
    uint public constant NFT_1 = 1;
    uint public constant NFT_2 = 2;

    uint[] public currentSupply = [50, 50, 50];

    uint public tokenPrice = 0.01 ether;

    address payable public immutable owner;

    // It can take variables (e.g. {id}) in the URL string.
    constructor() ERC1155("https://maroon-long-silkworm-773.mypinata.cloud/ipfs/QmYtw3CPwQTw2QjDNALrBbtHAoUGHH7yCuEaK8tf8vGb9K/Jimmy.jason") {
        owner = payable(msg.sender);
    }

    function mint(uint256 id) external payable {
        require(id < 3, "This token does not exists");
        require(msg.value >= tokenPrice, "Insufficient payment");
        require(currentSupply[id] > 0, "Max supply reached");

        _mint(msg.sender, id, 1, "");
        currentSupply[id]--;
    }

    function withdraw() external {
        require(msg.sender == owner, "You do not have permission");

        uint256 amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success == true, "Failed to withdraw");
    }

    function uri(uint256 id) public pure override returns (string memory) {
        return "https://maroon-long-silkworm-773.mypinata.cloud/ipfs/QmYtw3CPwQTw2QjDNALrBbtHAoUGHH7yCuEaK8tf8vGb9K/Jimmy.jason";
    }
}
