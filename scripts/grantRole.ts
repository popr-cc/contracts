import { ethers } from "hardhat";
import web3 from "web3";
import ERC721Standard from "../artifacts/contracts/tokens/ERC721Standard.sol/ERC721Standard.json";

const main = async () => {
  try {
    const address = "0xD8482a7AA54061C65Af49966f2C8a99a4D4A4f5A";
    const poprAddress = "0xF45C634B7D2193a6d3D38F94f62cB0A9Ba8DdaE0";

    const accounts = await ethers.getSigners();
    const signer = accounts[0];
    const contract = new ethers.Contract(address, ERC721Standard.abi, signer);

    const MINTER_ROLE = web3.utils.sha3("MINTER_ROLE");

    await contract.grantRole(MINTER_ROLE, poprAddress);

    console.log("Minter Role: ", MINTER_ROLE);
    console.log("POPR Address: ", poprAddress);

    console.log("Granted");

    const hasRole = await contract.hasRole(MINTER_ROLE, poprAddress);
    console.log("Has Role: ", hasRole);
  } catch (err) {
    console.error(err);
  }
};

main().then(() => {
  console.log(new Date());
});
