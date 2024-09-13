const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const ClimaGuard = await hre.ethers.getContractFactory("ClimaGuard");
  const climaGuard = await ClimaGuard.deploy();

  await climaGuard.deployed();

  console.log("ClimaGuard deployed to:", climaGuard.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
