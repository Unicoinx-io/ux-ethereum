import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import {
    BURN_AMOUNT,
    CONTRACT_NAME,
    FULL_AMOUNT_BALANCE,
    MINT_AMOUNT,
    MAX_SAFE_AMOUNT,
    NULL_ADDRESS_OF_CONTRACT,
    TRANSFER_AMOUNT,
    ZERO_BALANCE,
} from "./constants";

describe("Initialization contract", function () {
    async function deployTokenFixture() {
        const [
            admin,
            beneficiary1,
            beneficiary2,
        ] = await ethers.getSigners();
        const contractName : string | any = await ethers.deployContract(`${CONTRACT_NAME}`, [admin, beneficiary1, beneficiary2]);
        const decimals = await contractName.decimals();
        const contractOwner = await contractName.owner();
        const initialSupplyAdmin = await contractName.mint(admin.address, MINT_AMOUNT);
        const name = await contractName.name();
        const symbol = await contractName.symbol();

        await contractName.waitForDeployment();

        return {
            admin,
            beneficiary1,
            beneficiary2,
            contractName,
            contractOwner,
            decimals,
            initialSupplyAdmin,
            name,
            symbol,
        };
    }

    it("The contract should support the IERC20 interface", async function () {
        const { contractName } = await loadFixture(deployTokenFixture);

        const interfaceId = await contractName.supportsInterface('0x36372b07');
        expect(interfaceId).to.be.true;
    });

    it("The initial token balance of the admin should be set", async function () {
        const { contractName, admin } = await loadFixture(deployTokenFixture);
        const adminBalance = await contractName.balanceOf(admin.address);

        expect(await contractName.totalSupply()).to.equal(adminBalance);
    });

    describe("Deployment", function () {
        it('The symbol should be corrected', async ()=> {
            const { contractName, symbol} = await loadFixture(deployTokenFixture);

            expect(await contractName.symbol()).to.string(symbol);
        });

        it('The name should be corrected', async ()=> {
            const { contractName, name} = await loadFixture(deployTokenFixture);

            expect(await contractName.name()).to.string(name);
        });

        it("The right admin should be set", async function () {
            const { contractName, admin } = await loadFixture(deployTokenFixture);

            expect(await contractName.owner()).to.equal(admin.address);
        });

        it("The total supply of tokens should be assigned to the admin", async function () {
            const { contractName, admin} = await loadFixture(deployTokenFixture);
            const adminBalance = await contractName.balanceOf(admin.address);

            expect(await contractName.totalSupply()).to.equal(adminBalance);
        });
    });

    describe("Decimals", function () {
        it('The decimals should be corrected', async ()=> {
            const { contractName, decimals } = await loadFixture(deployTokenFixture);

            expect(await contractName.decimals()).to.equal(decimals);
        });

        it("Transfer tokens from the admin to beneficiary2, including decimals", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary2],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]);
        });
    });

    describe("Pause / Unpause", function () {
        it("Minting should be denied when paused", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            expect(await contractName.connect(admin).pause());

            await expect(
                contractName.mint(beneficiary2, MINT_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'EnforcedPause');

            expect(await contractName.connect(admin).unpause());

            await expect(
                contractName.mint(beneficiary2, MINT_AMOUNT))
                .to.be.changeTokenBalances(
                    contractName,
                    [beneficiary2],
                    [+MINT_AMOUNT]);
        });

        it("Transfers should be denied when paused", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
            } = await loadFixture(deployTokenFixture);
            expect(await contractName.connect(admin).pause());

            await expect(
                contractName.connect(admin).transfer(beneficiary1.address, TRANSFER_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'EnforcedPause');

            expect(await contractName.connect(admin).unpause());
            await expect(
                contractName.connect(admin).transfer(beneficiary1.address, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary1],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]);

        });

        it("Should be access to approve when Paused", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            expect(await contractName.connect(admin).pause());

            await contractName.connect(beneficiary2).approve(beneficiary1, TRANSFER_AMOUNT);

            await expect(
                contractName.transferFrom(beneficiary1.address, admin, TRANSFER_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'EnforcedPause');
        });

        it("Should fail to enable pause by not admin", async function () {
            const { contractName, beneficiary1 } = await loadFixture(deployTokenFixture);

            await expect(contractName.connect(beneficiary1).pause())
                .to.be.revertedWithCustomError(contractName, 'OwnableUnauthorizedAccount');
        });
    });

    describe("Mint", function () {
        it("Tokens should be minted for beneficiary2", async function () {
            const {
                contractName,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.mint(beneficiary2.address, MINT_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2],
                    [MINT_AMOUNT]);
        });

        it("Tokens should be minted by the admin for beneficiary2", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).mint(beneficiary2.address, MINT_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2],
                    [MINT_AMOUNT]);
        });

        it("Minting tokens should be denied to non-admins.", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(beneficiary1).mint(beneficiary2.address, MINT_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'OwnableUnauthorizedAccount');
        });
    });

    describe("Transfers", function () {
        it("Should transfer tokens from admin to beneficiary2", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary2],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]);
        });

        it("Should transfer tokens from beneficiary1 to beneficiary2", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary1.address, TRANSFER_AMOUNT);

            await expect(
                contractName.connect(beneficiary1).transfer(beneficiary2.address, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary1, beneficiary2],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]);
        });

        it("Should fully transfer the token balance from the admin to beneficiary2", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
                decimals,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, FULL_AMOUNT_BALANCE))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary2],
                    [-FULL_AMOUNT_BALANCE, 10n * (10n**decimals)]);

            expect( await contractName.balanceOf(admin.address))
                .to.be.equal(ZERO_BALANCE, 'Balance is zero');
        });

        it("Should fully transfer the token balance from beneficiary1 to beneficiary2", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
                decimals,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary1.address, MINT_AMOUNT);

            await expect(
                contractName.connect(beneficiary1).transfer(beneficiary2.address, FULL_AMOUNT_BALANCE))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary1, beneficiary2],
                    [-FULL_AMOUNT_BALANCE, 10n * (10n**decimals)]);

            expect( await contractName.balanceOf(beneficiary1.address))
                .to.be.equal(ZERO_BALANCE, 'Balance is zero');
        });

        it("It should fail if the admin doesn’t have enough tokens", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const initialAdminBalance = await contractName.balanceOf(admin.address);

            await expect(contractName.connect(admin)
                .transfer(beneficiary2.address, MAX_SAFE_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');

            expect(await contractName.balanceOf(admin.address)).to.equal(initialAdminBalance);
        });

        it("It should fail if beneficiary1 doesn’t have enough tokens", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const initialBeneficiary1Balance = await contractName.balanceOf(beneficiary1.address);

            await expect(contractName.connect(beneficiary1)
                .transfer(beneficiary2.address, MAX_SAFE_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');

            expect(await contractName.balanceOf(beneficiary1.address)).to.equal(initialBeneficiary1Balance);
        });

        it("It should succeed if the admin transfers 0 tokens", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const initialAdminBalance = await contractName.balanceOf(admin.address);

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, ZERO_BALANCE))
                .to.emit(contractName, "Transfer")
                .withArgs(admin.address, beneficiary2.address, ZERO_BALANCE);

            expect(await contractName.balanceOf(admin.address)).to.equal(initialAdminBalance);
        });

        it("It should succeed if the beneficiary1 transfers 0 tokens", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const initialBeneficiary1Balance = await contractName.balanceOf(beneficiary1.address);
            const zeroAmount = 0;

            await expect(
                contractName.connect(beneficiary1).transfer(beneficiary2.address, zeroAmount))
                .to.emit(contractName, 'Transfer')
                .withArgs(beneficiary1.address, beneficiary2.address, zeroAmount);

            expect(await contractName.balanceOf(beneficiary1.address)).to.equal(initialBeneficiary1Balance);
        });

        it("Should be the boundary values with sufficient balance", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const boundaryValue = 9_999_999;

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, boundaryValue))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary2],
                    [-boundaryValue, boundaryValue]);
        });

        it("Should be boundary values that exceed the balance limit", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const boundaryValue = 10_000_001;

            await expect(
                contractName.connect(admin).transfer(beneficiary2.address, boundaryValue))
                .to.be.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');

            const adminBalance = await contractName.balanceOf(admin.address);
            expect(await contractName.totalSupply()).to.equal(adminBalance);
        });
    });

    describe("Transfer From", function () {
        it("There should be an allowance for transferFrom from admin to beneficiary1", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.connect(admin).approve(beneficiary2, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary2).transferFrom(admin, beneficiary1, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary1],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                );
        });

        it("There should be an allowance for transferFrom from beneficiary1 to admin", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary2.address, MINT_AMOUNT);
            await contractName.connect(beneficiary2).approve(beneficiary1, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary1).transferFrom(beneficiary2, admin, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2, admin],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                );
        });

        it("There should be an allowance for transferFrom from beneficiary2 to beneficiary1", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary2.address, MINT_AMOUNT);
            await contractName.connect(beneficiary2).approve(admin, TRANSFER_AMOUNT);

            await expect(contractName.connect(admin).transferFrom(beneficiary2, beneficiary1, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2, beneficiary1],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                );
        });

        it("The transferFrom should be denied if it exceeds the approved limit", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.connect(admin).approve(beneficiary1, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary2, MAX_SAFE_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientAllowance');

            await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary2, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary2],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                );
        });

        it("The transferFrom should be denied if the balance is null", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.connect(beneficiary1).approve(admin, TRANSFER_AMOUNT);

            await expect(contractName.connect(admin).transferFrom(beneficiary1, beneficiary2, TRANSFER_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');
        });

        it("The transferFrom should be declined if there are insufficient funds for the transaction", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            const allowedAmount = 500_000;
            await contractName.mint(beneficiary2.address, allowedAmount);
            await contractName.connect(beneficiary2).approve(beneficiary1, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary1).transferFrom(beneficiary2, admin, TRANSFER_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');

            await expect(contractName.connect(beneficiary1).transferFrom(beneficiary2, admin, allowedAmount))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2, admin],
                    [-allowedAmount, allowedAmount]
                );
        });

        it("The transferFrom should be accessible if you make several transfers within the allowed limit", async function () {
            const {
                contractName,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary1.address, MAX_SAFE_AMOUNT);
            await contractName.connect(beneficiary1).approve(beneficiary2, MAX_SAFE_AMOUNT);

            for (let transaction = 0; transaction < 3; transaction++) {
                await expect(contractName.connect(beneficiary2).transferFrom(beneficiary1, beneficiary2, TRANSFER_AMOUNT))
                    .to.changeTokenBalances(
                        contractName,
                        [beneficiary1, beneficiary2],
                        [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                    );
            }
            await expect(contractName.connect(beneficiary2).transferFrom(beneficiary1, beneficiary2, MAX_SAFE_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientAllowance');
        });

        it("The allowance for the transfer don't accumulate", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.connect(admin).approve(beneficiary1, 2_000_000);

            await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary1, TRANSFER_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary1],
                    [-TRANSFER_AMOUNT, TRANSFER_AMOUNT]
                );

            await contractName.connect(admin).approve(beneficiary1, 500_000);

            await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary1, TRANSFER_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientAllowance');

            await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary1, 500_000))
                .to.changeTokenBalances(
                    contractName,
                    [admin, beneficiary1],
                    [-500_000, 500_000]
                );

            await contractName.connect(admin).approve(beneficiary1, TRANSFER_AMOUNT);

            for (let transaction = 0; transaction < 2; transaction++) {
                await expect(contractName.connect(beneficiary1).transferFrom(admin, beneficiary2, 500_000))
                    .to.changeTokenBalances(
                        contractName,
                        [admin, beneficiary2],
                        [-500_000, 500_000]
                    );
            }
            const initialSupplyAdmin = await contractName.balanceOf(admin.address);
            const initialSupplyBeneficiary1 = await contractName.balanceOf(beneficiary1.address);
            const initialSupplyBeneficiary2 = await contractName.balanceOf(beneficiary2.address);

            expect(await contractName.totalSupply()).to.equal(initialSupplyAdmin + initialSupplyBeneficiary1 + initialSupplyBeneficiary2);
        });
    });

    describe('Burn', function () {
        it("Tokens should be burned for the admin", async function () {
            const {
                contractName,
                admin,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).burn(BURN_AMOUNT))
                .to.changeTokenBalances(
                    contractName,
                    [admin],
                    [-BURN_AMOUNT]);

            expect(await contractName.balanceOf(admin.address))
                .to.be.equal(ZERO_BALANCE, 'Balance is zero');
        });

        it("Tokens should be burned for the beneficiary", async function () {
            const {
                contractName,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.mint(beneficiary2.address, MINT_AMOUNT);
            const burnAmount = MINT_AMOUNT;

            await expect(
                contractName.connect(beneficiary2).burn(burnAmount))
                .to.changeTokenBalances(
                    contractName,
                    [beneficiary2],
                    [-burnAmount]);
        });

        it("Tokens should not be burned in excess of the available balance", async function () {
            const {
                contractName,
                admin,
                decimals,
            } = await loadFixture(deployTokenFixture);
            const adminBalance = await contractName.balanceOf(admin.address);
            const burnAmount = 11n * (10n ** decimals);

            await expect(
                contractName.connect(admin).burn(burnAmount))
                .to.be.revertedWithCustomError(contractName, 'ERC20InsufficientBalance');

            expect(await contractName.totalSupply()).to.equal(adminBalance);
        });

        it("Tokens should not be allowed to be burned from a beneficiary’s account without approval", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
            } = await loadFixture(deployTokenFixture);

            await expect(contractName.connect(admin).burnFrom(beneficiary1, BURN_AMOUNT))
                .to.revertedWithCustomError(contractName, 'ERC20InsufficientAllowance');
        });
    });

    describe("Ownable", function () {
        it("The owner should be corrected", async function () {
            const { contractName, contractOwner} = await loadFixture(deployTokenFixture);

            expect(await contractName.owner()).to.string(contractOwner);
        });

        it("The owner should renounce ownership", async function () {
            const { contractName, admin} = await loadFixture(deployTokenFixture);

            await contractName.connect(admin).renounceOwnership();
            expect(await contractName.owner()).to.equal(NULL_ADDRESS_OF_CONTRACT);
        });

        it("The beneficiary should not renounce ownership", async function () {
            const { contractName, beneficiary1, contractOwner} = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(beneficiary1).renounceOwnership())
                .to.be.revertedWithCustomError(contractName, 'OwnableUnauthorizedAccount');

            expect(await contractName.owner()).to.equal(contractOwner);
        });

        it("The owner should transfer ownership", async function () {
            const { contractName, admin, beneficiary1} = await loadFixture(deployTokenFixture);

            await contractName.connect(admin).transferOwnership(beneficiary1.address);
            const newOwnerBeneficiary = await contractName.owner();

            expect(await contractName.owner()).to.equal(newOwnerBeneficiary);

            await expect(
                contractName.connect(admin).renounceOwnership())
                .to.be.revertedWithCustomError(contractName, 'OwnableUnauthorizedAccount');
        });
    });

    describe('Events', function () {
        it("Events should be emitted when the contract is paused or unpaused", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(await contractName.connect(admin).pause())
                .to.emit(contractName, "Paused")
                .withArgs(admin.address)

            await expect(
                contractName.mint(beneficiary2, MINT_AMOUNT))
                .to.be.revertedWithCustomError(contractName, 'EnforcedPause');

            await expect(await contractName.connect(admin).unpause())
                .to.emit(contractName, "Unpaused")
                .withArgs(admin.address)

            await expect(
                contractName.mint(beneficiary2, MINT_AMOUNT))
                .to.emit(contractName, "Transfer")
                .withArgs(NULL_ADDRESS_OF_CONTRACT, beneficiary2.address, MINT_AMOUNT);
        });

        it("Events should be emitted upon minting", async function () {
            const {
                contractName,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(
                contractName.mint(beneficiary2.address, MINT_AMOUNT))
                .to.emit(contractName, "Transfer")
                .withArgs(NULL_ADDRESS_OF_CONTRACT, beneficiary2.address, MINT_AMOUNT);
        });

        it("Events should be emitted upon transferring", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect(contractName.transfer(beneficiary1.address, TRANSFER_AMOUNT))
                .to.emit(contractName, "Transfer")
                .withArgs(admin.address, beneficiary1.address, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary1).transfer(beneficiary2.address, TRANSFER_AMOUNT))
                .to.emit(contractName, "Transfer")
                .withArgs(beneficiary1.address, beneficiary2.address, TRANSFER_AMOUNT);
        });

        it("Events should be emitted during transferFrom operations", async function () {
            const {
                contractName,
                admin,
                beneficiary1,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);
            await contractName.connect(admin).approve(beneficiary2, TRANSFER_AMOUNT);

            await expect(contractName.connect(beneficiary2).transferFrom(admin, beneficiary1, TRANSFER_AMOUNT))
                .to.emit(contractName, "Transfer")
                .withArgs(admin.address, beneficiary1.address, TRANSFER_AMOUNT);
        });

        it("Events should be emitted upon approval", async function () {
            const {
                contractName,
                admin,
                beneficiary2,
            } = await loadFixture(deployTokenFixture);

            await expect (contractName.connect(admin).approve(beneficiary2, TRANSFER_AMOUNT))
                .to.emit(contractName, "Approval")
                .withArgs(admin.address, beneficiary2.address, TRANSFER_AMOUNT);
        });

        it("Events should be emitted upon burning", async function () {
            const {contractName, admin} = await loadFixture(deployTokenFixture);

            await expect(
                contractName.connect(admin).burn(BURN_AMOUNT))
                .to.emit(contractName, 'Transfer')
                .withArgs(admin.address, NULL_ADDRESS_OF_CONTRACT, BURN_AMOUNT);
        });

        it("Events should be emitted during renounceOwnership operation", async function () {
            const { contractName, admin} = await loadFixture(deployTokenFixture);

            await expect(contractName.connect(admin).renounceOwnership())
                .to.emit(contractName, "OwnershipTransferred")
                .withArgs(admin.address, NULL_ADDRESS_OF_CONTRACT);

            expect(await contractName.owner()).to.equal(NULL_ADDRESS_OF_CONTRACT);
        });
    });
});
