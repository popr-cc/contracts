import { ethers, upgrades } from "hardhat";
import { Contract, Signer } from "ethers";
import { assert, expect } from "chai";
import web3 from "web3";

describe("Proof of Pull Request", function () {
  let erc721StandardContract: Contract;
  let poprContract: Contract;
  let accounts: Signer[];

  before(async () => {
    const POPR = await ethers.getContractFactory("ProofOfPullRequest");
    const ERC721Standard = await ethers.getContractFactory("ERC721Standard");

    erc721StandardContract = await ERC721Standard.deploy(
      "Proof of Pull Request",
      "POPR"
    );

    poprContract = await upgrades.deployProxy(POPR, [
      erc721StandardContract.address,
    ]);

    console.log("ERC721 Contract: ", erc721StandardContract.address);
    console.log("POPR Contract: ", poprContract.address);

    const MINTER_ROLE = web3.utils.sha3("MINTER_ROLE");

    await erc721StandardContract.grantRole(MINTER_ROLE, poprContract.address);

    accounts = await ethers.getSigners();
  });

  it("should mint from popr contract", async () => {
    let uri = `https://www.test.com/0/1`;
    let address = await accounts[0].getAddress();
    await expect(poprContract.mint(uri))
      .to.emit(poprContract, "Minted")
      .withArgs(address, 0);

    uri = `https://www.test.com/0/2`;
    await expect(poprContract.mint(uri))
      .to.emit(poprContract, "Minted")
      .withArgs(address, 1);

    uri = `https://www.test.com/0/3`;
    await expect(poprContract.mint(uri))
      .to.emit(poprContract, "Minted")
      .withArgs(address, 2);

    let poprContract1 = await poprContract.connect(accounts[1]);
    address = await accounts[1].getAddress();
    uri = `https://www.test.com/1/1`;
    await expect(poprContract1.mint(uri))
      .to.emit(poprContract1, "Minted")
      .withArgs(address, 3);

    uri = `https://www.test.com/1/2`;
    await expect(poprContract1.mint(uri))
      .to.emit(poprContract1, "Minted")
      .withArgs(address, 4);

    uri = `https://www.test.com/1/3`;
    await expect(poprContract1.mint(uri))
      .to.emit(poprContract1, "Minted")
      .withArgs(address, 5);
  });
});
