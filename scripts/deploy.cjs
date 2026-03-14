const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(deployer.address);

    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║       GAZA INITIATIVE — TESTNET DEPLOYMENT      ║");
    console.log("╚══════════════════════════════════════════════════╝");
    console.log(`  Deployer:  ${deployer.address}`);
    console.log(`  Balance:   ${hre.ethers.formatEther(balance)} POL`);
    console.log(`  Network:   ${hre.network.name}`);
    console.log("──────────────────────────────────────────────────");

    // Use deployer as both owner and treasury for testnet
    const ownerAddress = deployer.address;
    const treasuryAddress = deployer.address;

    // ─── Step 1: Deploy GAZAINToken ───
    console.log("\n⏳ [1/2] Deploying GAZAINToken...");
    const GAZAINToken = await hre.ethers.getContractFactory("GAZAINToken");
    const gazaToken = await GAZAINToken.deploy(ownerAddress, treasuryAddress);
    await gazaToken.waitForDeployment();
    const tokenAddress = await gazaToken.getAddress();
    console.log(`  ✅ GAZAINToken deployed to: ${tokenAddress}`);

    // ─── Step 2: Deploy GazaGuardiansNFT ───
    console.log("\n⏳ [2/2] Deploying GazaGuardiansNFT...");
    const GazaGuardiansNFT = await hre.ethers.getContractFactory("GazaGuardiansNFT");
    const nft = await GazaGuardiansNFT.deploy(ownerAddress, tokenAddress, treasuryAddress);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log(`  ✅ GazaGuardiansNFT deployed to: ${nftAddress}`);

    // ─── Summary ───
    console.log("\n══════════════════════════════════════════════════");
    console.log("  🎉 DEPLOYMENT COMPLETE!");
    console.log("══════════════════════════════════════════════════");
    console.log(`  GAZAINToken:      ${tokenAddress}`);
    console.log(`  GazaGuardiansNFT: ${nftAddress}`);
    console.log(`  Treasury:         ${treasuryAddress}`);
    console.log(`  Owner:            ${ownerAddress}`);
    console.log("──────────────────────────────────────────────────");
    console.log("  📋 NEXT STEPS:");
    console.log(`  1. Add to your .env or Vercel env vars:`);
    console.log(`     VITE_GAZAIN_ADDRESS=${tokenAddress}`);
    console.log(`     VITE_NFT_ADDRESS=${nftAddress}`);
    console.log(`  2. Verify contracts (optional):`);
    console.log(`     npx hardhat verify --network ${hre.network.name} ${tokenAddress} ${ownerAddress} ${treasuryAddress}`);
    console.log(`     npx hardhat verify --network ${hre.network.name} ${nftAddress} ${ownerAddress} ${tokenAddress} ${treasuryAddress}`);
    console.log("══════════════════════════════════════════════════\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
