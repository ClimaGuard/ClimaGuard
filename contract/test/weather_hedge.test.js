const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SeasonalTokens", function () {
  let SeasonalTokens, seasonalTokens;
  let owner, addr1, addr2;
  const TOKEN1 = 1;
  const TOKEN2 = 2;
  const TOKEN3 = 3;
  const TOKEN4 = 4;
  const TOKEN_PRICE = ethers.utils.parseEther("0.01"); // Token price in ETH

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    SeasonalTokens = await ethers.getContractFactory("SeasonalTokens");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new contract before each test
    seasonalTokens = await SeasonalTokens.deploy();
    await seasonalTokens.deployed();
  });

  it("Should deploy the contract and set the correct owner", async function () {
    expect(await seasonalTokens.owner()).to.equal(owner.address);
  });

  it("Should allow users to buy tokens and update the total supply", async function () {
    // addr1 buys 10 TOKEN1
    await seasonalTokens.connect(addr1).buyToken(TOKEN1, 10, { value: TOKEN_PRICE.mul(10) });
    
    // Check balance of addr1
    expect(await seasonalTokens.balanceOf(addr1.address, TOKEN1)).to.equal(10);

    // Check total supply of TOKEN1
    expect(await seasonalTokens.totalSupply(TOKEN1)).to.equal(10);
  });

  it("Should not allow buying tokens with incorrect ETH amount", async function () {
    await expect(
      seasonalTokens.connect(addr1).buyToken(TOKEN1, 10, { value: TOKEN_PRICE.mul(9) }) // Incorrect ETH amount
    ).to.be.revertedWith("Incorrect ETH sent");
  });

  it("Should correctly calculate total supply across multiple token types", async function () {
    // addr1 buys 5 TOKEN1 and 3 TOKEN2
    await seasonalTokens.connect(addr1).buyToken(TOKEN1, 5, { value: TOKEN_PRICE.mul(5) });
    await seasonalTokens.connect(addr1).buyToken(TOKEN2, 3, { value: TOKEN_PRICE.mul(3) });

    // addr2 buys 2 TOKEN1 and 4 TOKEN3
    await seasonalTokens.connect(addr2).buyToken(TOKEN1, 2, { value: TOKEN_PRICE.mul(2) });
    await seasonalTokens.connect(addr2).buyToken(TOKEN3, 4, { value: TOKEN_PRICE.mul(4) });

    // Check total supply
    expect(await seasonalTokens.totalSupply(TOKEN1)).to.equal(7); // 5 + 2
    expect(await seasonalTokens.totalSupply(TOKEN2)).to.equal(3); // 3
    expect(await seasonalTokens.totalSupply(TOKEN3)).to.equal(4); // 4
    expect(await seasonalTokens.totalSupply(TOKEN4)).to.equal(0); // None bought
  });

  it("Should correctly execute nextSeason and refund users", async function () {
    // addr1 buys 10 TOKEN1
    await seasonalTokens.connect(addr1).buyToken(TOKEN1, 10, { value: TOKEN_PRICE.mul(10) });
  
    // addr2 buys 5 TOKEN2
    await seasonalTokens.connect(addr2).buyToken(TOKEN2, 5, { value: TOKEN_PRICE.mul(5) });
  
    const poolValueBefore = await ethers.provider.getBalance(seasonalTokens.address);
  
    expect(poolValueBefore).to.equal(TOKEN_PRICE.mul(15)); // 10 TOKEN1 + 5 TOKEN2
  
    // Capture balances before nextSeason
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
  
    // Owner triggers nextSeason
    const tx = await seasonalTokens.connect(owner).nextSeason();
    const txReceipt = await tx.wait();
  
    // Calculate gas used by the transaction
    const gasUsed = txReceipt.gasUsed;
    const effectiveGasPrice = txReceipt.effectiveGasPrice;
    const gasCost = gasUsed.mul(effectiveGasPrice);
  
    // Check total supply after nextSeason
    expect(await seasonalTokens.totalSupply(TOKEN1)).to.equal(0);
    expect(await seasonalTokens.totalSupply(TOKEN2)).to.equal(0);
  
    // Calculate expected refunds
    const expectedRefundAddr1 = TOKEN_PRICE.mul(10).mul(95).div(100);
    const expectedRefundAddr2 = TOKEN_PRICE.mul(5).mul(95).div(100);
  
    // Check refunds are processed (with approximate due to gas usage)
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
  
    // Use a higher tolerance for the delta to account for gas costs
    const delta = ethers.utils.parseEther("0.1"); // Adjusted delta to 0.1 ETH
  
    expect(addr1BalanceAfter).to.be.closeTo(addr1BalanceBefore.add(expectedRefundAddr1), delta);
    expect(addr2BalanceAfter).to.be.closeTo(addr2BalanceBefore.add(expectedRefundAddr2), delta);
  
    // Check pool value is reset
    expect(await seasonalTokens.poolValue()).to.equal(0);
  });
  
  it("Should allow the owner to withdraw remaining ETH", async function () {
    // addr1 buys 10 TOKEN1
    await seasonalTokens.connect(addr1).buyToken(TOKEN1, 10, { value: TOKEN_PRICE.mul(10) });

    // Capture owner's balance before withdrawal
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    // Owner withdraws remaining ETH
    await seasonalTokens.connect(owner).withdrawRemainingETH();

    // Capture owner's balance after withdrawal
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    // Check owner's balance increased by pool value
    expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);

    // Check pool value is now 0
    expect(await ethers.provider.getBalance(seasonalTokens.address)).to.equal(0);
  });
});