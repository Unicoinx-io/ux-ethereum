import { ethers } from "hardhat";
import { CONTRACT_NAME } from "../test/constants";

async function testContracts() {

    const [admin, beneficiary1, beneficiary2] = await ethers.getSigners();
    const contractName : string | any = await ethers.deployContract(`${CONTRACT_NAME}`, [admin, beneficiary1, beneficiary2]);

    await contractName.waitForDeployment();
}

testContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
