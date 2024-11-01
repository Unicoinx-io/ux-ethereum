import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ledger";
require('dotenv').config({path:__dirname+'/.env'});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.20",
            }
        ],
    }
};

task("test-contract", "Deploys a specific contract")
    .addParam<string>("contract", "The name of the contract to test")
    .setAction(async (taskArgs, hre) => {
        const contractName = await taskArgs.contract;

        const contractGet : string | any = await hre.ethers.getContractFactory(contractName);

        await hre.run("test", { contractGet });
    });

export default config;
