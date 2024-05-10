require("@nomicfoundation/hardhat-toolbox");

const NEXT_PUBLIC_POLYGON_MUMBAI_RPC =
  "https://polygon-mainnet.g.alchemy.com/v2/4iq6O0InussottSS-R2-vj8HGams1WTK";
const NEXT_PUBLIC_PRIVATE_KEY = "490f9f1cd887387a3468bf2060d5bfe69a771bf11f0a6974aec3550e3bf08fcd";
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "matic",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: NEXT_PUBLIC_POLYGON_MUMBAI_RPC,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    },
  },
};
