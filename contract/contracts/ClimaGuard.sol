// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin ERC1155 implementation and SafeMath library
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ClimaGuard is ERC1155, Ownable {
    using SafeMath for uint256;

    // Token IDs
    uint256 public constant TOKEN1 = 1; // 10% precipitation, -10% temperature
    uint256 public constant TOKEN2 = 2; // 10% precipitation, 10% temperature
    uint256 public constant TOKEN3 = 3; // -10% precipitation, -10% temperature
    uint256 public constant TOKEN4 = 4; // -10% precipitation, 10% temperature

    // Mapping to track total supply of each token type
    mapping(uint256 => uint256) private _totalSupply;

    // Pool value in ETH
    uint256 public poolValue;

    // Token prices in ETH
    uint256 public constant TOKEN_PRICE = 0.01 ether;

    constructor() ERC1155("https://raw.githubusercontent.com/ClimaGuard/ClimaGuard/main/contract/token/{id}.json") {}

    // Function to buy tokens
    function buyToken(uint256 tokenId, uint256 amount) external payable {
        require(tokenId >= TOKEN1 && tokenId <= TOKEN4, "Invalid token ID");
        require(msg.value == amount.mul(TOKEN_PRICE), "Incorrect ETH sent");

        // Mint the tokens to the buyer
        _mint(msg.sender, tokenId, amount, "");

        // Update total supply
        _totalSupply[tokenId] = _totalSupply[tokenId].add(amount);

        // Add ETH to the pool value
        poolValue = poolValue.add(msg.value);
    }

    // Function to get total supply of a specific token
    function totalSupply(uint256 tokenId) public view returns (uint256) {
        require(tokenId >= TOKEN1 && tokenId <= TOKEN4, "Invalid token ID");
        return _totalSupply[tokenId];
    }

    // Function to implement the next season
    function nextSeason() external onlyOwner {
        uint256 totalRefund = poolValue.mul(95).div(100); // 95% of the pool value
        uint256 totalSupplyTokens = 0;

        // Calculate total supply of all tokens
        for (uint256 i = TOKEN1; i <= TOKEN4; i++) {
            totalSupplyTokens = totalSupplyTokens.add(totalSupply(i));
        }

        require(totalSupplyTokens > 0, "No tokens to refund");

        // Iterate through each token type and refund holders
        for (uint256 i = TOKEN1; i <= TOKEN4; i++) {
            uint256 supply = totalSupply(i);

            if (supply > 0) {
                // Calculate the refund amount for this token type
                uint256 refundPerToken = totalRefund.mul(supply).div(totalSupplyTokens);

                // Iterate over all token holders and refund them proportionally
                uint256 balance = balanceOf(msg.sender, i);
                if (balance > 0) {
                    _burn(msg.sender, i, balance);
                    uint256 refundAmount = refundPerToken.mul(balance).div(supply);
                    payable(msg.sender).transfer(refundAmount);
                }

                // Reset total supply for this token type
                _totalSupply[i] = 0;
            }
        }

        // Reset the pool value after refunds
        poolValue = 0;
    }

    // Withdraw any remaining ETH (owner only)
    function withdrawRemainingETH() external onlyOwner {
        uint256 remainingETH = address(this).balance;
        require(remainingETH > 0, "No ETH to withdraw");
        payable(owner()).transfer(remainingETH);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
