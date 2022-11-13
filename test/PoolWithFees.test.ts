import { ethers } from "hardhat";
import { expect } from "chai";

describe("PoolWithFees Contract", function () {
  beforeEach(async function () {
    const [account, anotherAccount] = await ethers.getSigners();
    this.account = account;
    this.anotherAccount = anotherAccount;

    const ERC20Factory = await ethers.getContractFactory("SimpleERC20");

    this.ERC20 = this.contract = await ERC20Factory.deploy();
    this.ERC20WithAccount = await this.contract.connect(this.account);

    await this.ERC20.deployed();

    const contractFactory = await ethers.getContractFactory("PoolWithFees");

    const fee = 3;

    this.pool = this.contract = await contractFactory.deploy(
      this.ERC20.address,
      fee
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

  describe("swapETHForERC20", function () {
    it("emits SwapCompleted", async function () {
      const swapAmount = ethers.utils.parseEther("1");
      const poolETHBalancePreSwap = await this.pool.getETHBalance();
      const poolERC20BalancePreSwap = await this.pool.getERC20Balance();
      const price = await this.pool.getETHSwapPrice(swapAmount);

      await expect(
        await this.poolWithAccount.swapETHForERC20({
          value: swapAmount,
        })
      )
        .emit(this.pool, "SwapETHCompleted")
        .withArgs(this.account.address, swapAmount, price);

      const poolETHBalancePostSwap = await this.pool.getETHBalance();
      const poolERC20BalancePostSwap = await this.pool.getERC20Balance();

      expect(poolETHBalancePreSwap).equal(
        poolETHBalancePostSwap.sub(swapAmount)
      );
      expect(poolERC20BalancePreSwap).equal(
        poolERC20BalancePostSwap.add(price)
      );
    });
  });

  describe("swapERC20ForETH", function () {
    it("emits SwapCompleted", async function () {
      const swapAmount = ethers.utils.parseEther("1");
      const poolETHBalancePreSwap = await this.pool.getETHBalance();
      const poolERC20BalancePreSwap = await this.pool.getERC20Balance();
      const price = await this.pool.getERC20SwapPrice(swapAmount);

      await this.ERC20.approve(this.pool.address, swapAmount);

      await expect(await this.poolWithAccount.swapERC20ForETH(swapAmount))
        .emit(this.pool, "SwapERC20Completed")
        .withArgs(this.account.address, swapAmount, price);

      const poolETHBalancePostSwap = await this.pool.getETHBalance();
      const poolERC20BalancePostSwap = await this.pool.getERC20Balance();

      expect(poolETHBalancePreSwap).equal(poolETHBalancePostSwap.add(price));
      expect(poolERC20BalancePreSwap).equal(
        poolERC20BalancePostSwap.sub(swapAmount)
      );
    });
  });

  describe("fees", function () {
    it("accumulates fees over time", async function () {
      const swapAmount = ethers.utils.parseEther("1");
      const poolETHBalancePreSwap = await this.pool.getETHBalance();
      const poolERC20BalancePreSwap = await this.pool.getERC20Balance();

      await this.ERC20.approve(this.pool.address, swapAmount.mul(500));

      for (let i = 0; i < 500; i++) {
        await this.poolWithAccount.swapERC20ForETH(swapAmount);
        await this.poolWithAccount.swapETHForERC20({
          value: swapAmount,
        });
      }

      const poolETHBalancePostSwap = await this.pool.getETHBalance();
      const poolERC20BalancePostSwap = await this.pool.getERC20Balance();

      expect(poolETHBalancePreSwap).lessThan(poolETHBalancePostSwap);
      expect(poolERC20BalancePreSwap).lessThan(poolERC20BalancePostSwap);
    });
  });
});
