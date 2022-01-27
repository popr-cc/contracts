import { ethers, upgrades } from "hardhat";
import web3 from "web3";

const main = async () => {
  const accounts = await ethers.getSigners();
  const address = await accounts[0].getAddress();

  console.log("Deploying from Address: ", address);

  const POPR = await ethers.getContractFactory("ProofOfPullRequest");
  const ERC721Standard = await ethers.getContractFactory("ERC721Standard");

  const erc721Standard = await ERC721Standard.deploy(
    "Proof of Pull Request",
    "POPR"
  );

  const popr = await upgrades.deployProxy(POPR, [erc721Standard.address]);

  console.log(`POPR Deployed to ${popr.address}`);
  console.log(`ERC721Standard Deployed to ${erc721Standard.address}`);

  const MINTER_ROLE = web3.utils.sha3("MINTER_ROLE");

  await erc721Standard.grantRole(MINTER_ROLE, popr.address);

  console.log("Done");
};

main().then(() => {
  console.log(new Date());
});
