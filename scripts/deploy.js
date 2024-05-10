const hre = require("hardhat");

// Define the tokens function to accept value and decimals arguments
const tokens = (nToken, decimals) => {
    // Convert the numerical value to string and return
    return ethers.utils.parseUnits(nToken.toString(), decimals);
};

async function main() {
    // WOOX Token
    const _initialSupply = tokens("500000000000", 18); // Pass value as a string and specify decimals
    const Woox = await hre.ethers.getContractFactory("Woox");
    const woox = await Woox.deploy(_initialSupply);
    await woox.deployed();
    console.log(`Woox: ${woox.address}`);

    // ICO Woox
    const _tokenPrice = tokens("0.0001", 18); // Pass value as a string and specify decimals
    const ICOWoox = await hre.ethers.getContractFactory("ICOWoox");
    const icoWoox = await ICOWoox.deploy(woox.address, _tokenPrice);
    await icoWoox.deployed();
    console.log(`ICOWoox: ${icoWoox.address}`);

    // Liquidity
    const Liquidity = await hre.ethers.getContractFactory("Liquidity");
    const liquidity = await Liquidity.deploy(); // Corrected syntax for deployment
    await liquidity.deployed();
    console.log(`Liquidity: ${liquidity.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
