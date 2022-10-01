import { ethers } from "hardhat";
import { expect } from "chai";

describe("PoolNoFeesLiquidityProvided Contract", function () {
  beforeEach(async function () {
    const [account, anotherAccount] = await ethers.getSigners();
    this.account = account;
    this.anotherAccount = anotherAccount;

    const ERC20Factory = await ethers.getContractFactory("SimpleERC20");

    this.ERC20 = this.contract = await ERC20Factory.deploy();
    this.ERC20WithAccount = await this.contract.connect(this.account);

    await this.ERC20.deployed();

    const contractFactory = await ethers.getContractFactory(
      "PoolNoFeesLiquidityProvided"
    );

    this.pool = this.contract = await contractFactory.deploy(
      this.ERC20.address
    );

    this.poolWithAccount = await this.contract.connect(this.account);

    await this.pool.deployed();

    await this.account.sendTransaction({
      to: this.pool.address,
      value: ethers.utils.parseEther("1000"),
    });

    await this.ERC20.transfer(
      this.pool.address,
      ethers.utils.parseEther("1000")
    );
  });

  describe("Deployment", function () {
    it("Should have the correct token", async function () {
      expect(this.ERC20.address).equal(await this.pool.token());
    });
    it("Should have equal amounts of ETH and ERC20 token", async function () {
      expect(await this.poolWithAccount.getERC20Balance()).equal(
        await this.poolWithAccount.getETHBalance()
      );
    });
  });

  describe("swapETHforERC20", function () {
    it("emits SwapCompleted", async function () {
      expect(
        await this.poolWithAccount.swapETHforERC20(
          ethers.utils.parseEther("10000000000000000000")
        )
      ).emit(this.pool, "SwapCompleted");
    });
  });
});
