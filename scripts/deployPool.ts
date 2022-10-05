import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory(
    "PoolNoFeesLiquidityProvided"
  );
  const contract = await Contract.deploy(
    "0x1B66F72E2aD41Fab10EFa591A224f1f52C44D855"
  );

  await contract.deployed();

  console.log(`Contract successfully deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
