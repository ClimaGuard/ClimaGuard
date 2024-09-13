/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeatherHedge", function () {
  it("test minting", async function () {
    const WeatherHedge = await ethers.getContractFactory("WeatherHedge");
    const weatherHedge = await WeatherHedge.deploy();
    await weatherHedge.deployed();
    console.log("weatherHedge deployed at:" + weatherHedge.address);

    const owner = await ethers.getSigner();
    await weatherHedge.mint(0, { value: ethers.utils.parseEther("0.01") });
  
    const balance = await weatherHedge.balanceOf(owner.address, 0);
    const supply = await weatherHedge.currentSupply(0);
  
    expect(balance).to.equal(1, "Can't mint");
    expect(supply).to.equal(49, "Can't mint");
  });
});
