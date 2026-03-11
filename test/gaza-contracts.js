import pkgChai from "chai";
const { expect } = pkgChai;
import pkg from "hardhat";
const { ethers } = pkg;

describe("Gaza Initiative Contracts", function () {
    let token, nft;
    let owner, treasury, user1, user2;
    const MAX_SUPPLY = ethers.parseEther("1000000000"); // 1 Billion tokens

    beforeEach(async function () {
        [owner, treasury, user1, user2] = await ethers.getSigners();

        // Deploy $GAZAIN Token
        const Token = await ethers.getContractFactory("GAZAINToken");
        token = await Token.deploy(owner.address, treasury.address);

        // Deploy Gaza Guardians NFT
        const NFT = await ethers.getContractFactory("GazaGuardiansNFT");
        nft = await NFT.deploy(owner.address, await token.getAddress(), treasury.address);
    });

    describe("GAZAINToken (ERC-20)", function () {

        it("1. Should send 3% tax to the treasury on regular transfers", async function () {
            // Owner transfers 100,000 tokens to user1 (No tax applied because owner is excluded)
            const initialTransferAmount = ethers.parseEther("100000");
            await token.transfer(user1.address, initialTransferAmount);

            // Now user1 transfers 10,000 tokens to user2 (Tax should apply)
            const transferAmount = ethers.parseEther("10000");
            await token.connect(user1).transfer(user2.address, transferAmount);

            // Check balances
            const expectedTax = (transferAmount * 3n) / 100n; // 3% of 10,000 = 300
            const expectedReceive = transferAmount - expectedTax; // 9,700

            expect(await token.balanceOf(user2.address)).to.equal(expectedReceive);
            expect(await token.balanceOf(treasury.address)).to.equal(expectedTax);
        });

        it("2. Should not apply fee if sender or receiver is excluded from fee", async function () {
            const transferAmount = ethers.parseEther("10000");

            // Owner is excluded by default
            const initialTreasuryBalance = await token.balanceOf(treasury.address);
            await token.transfer(user1.address, transferAmount);

            const finalTreasuryBalance = await token.balanceOf(treasury.address);

            expect(finalTreasuryBalance).to.equal(initialTreasuryBalance); // No tax taken
            expect(await token.balanceOf(user1.address)).to.equal(transferAmount); // user1 receives full amount
        });
    });

    describe("GazaGuardiansNFT (ERC-721)", function () {
        const MINT_PRICE = ethers.parseEther("0.05");

        it("3. Should fail minting if user has < 50,000 $GAZAIN", async function () {
            // User1 tries to mint with 0 $GAZAIN balance
            expect(await token.balanceOf(user1.address)).to.equal(0n);

            await expect(
                nft.connect(user1).mint("ipfs://test-uri", { value: MINT_PRICE })
            ).to.be.revertedWithCustomError(nft, "NotWhitelisted");
        });

        it("4. Should succeed minting if user has > 50,000 $GAZAIN and pays 0.05 ETH", async function () {
            // Owner (excluded from fee) funds User1 with exactly 50,001 tokens
            const eligibleAmount = ethers.parseEther("50001");
            await token.transfer(user1.address, eligibleAmount);

            expect(await token.balanceOf(user1.address)).to.equal(eligibleAmount);

            // User1 mints successfully
            await expect(
                nft.connect(user1).mint("ipfs://test-uri", { value: MINT_PRICE })
            ).to.not.be.reverted;

            // Check NFT ownership
            expect(await nft.ownerOf(1n)).to.equal(user1.address);
            expect(await nft.tokenURI(1n)).to.equal("ipfs://test-uri");
        });

        it("5. Should allow the owner to withdraw all funds to the treasury", async function () {
            // Fund user1 to make them eligible
            await token.transfer(user1.address, ethers.parseEther("100000"));

            // User1 Mints 2 NFTs = 0.10 ETH total in contract
            await nft.connect(user1).mint("ipfs://test1", { value: MINT_PRICE });
            await nft.connect(user1).mint("ipfs://test2", { value: MINT_PRICE });

            const contractBalance = await ethers.provider.getBalance(await nft.getAddress());
            expect(contractBalance).to.equal(MINT_PRICE * 2n);

            // Record treasury balance before withdrawal
            const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

            // Owner withdraws
            await nft.withdraw();

            // Verify contract balance is 0
            const finalContractBalance = await ethers.provider.getBalance(await nft.getAddress());
            expect(finalContractBalance).to.equal(0n);

            // Verify Treasury received the funds (0.10 ETH)
            const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
            expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(MINT_PRICE * 2n);
        });
    });
});
