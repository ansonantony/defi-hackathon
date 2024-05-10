import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.json";

import toast from "react-hot-toast";
import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as INonFungiblePositionMangerABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/INonFungiblePositionManger.sol/INonFungiblePositionManger.json";

import ERC20ABI from "./abi.json";

import {
  ERC20_ABI,
  TOKEN_ABI,
  V3_SWAP_ROUTER_ADDRESS,
  CONNECTING_CONTRACT,
  FACTORY_ABI,
  FACTORY_ADDRESS,
  web3Provider,
  positionManagerAddress,
  internalWooxContract,
  internalICOWooxContract,
  internalAddLiqudity,
  getBalance,
} from "./constants";

export const CONTEXT = React.createContext();

export const CONTEXT_Provider = ({ children }) => {
  const DAPP_NAME = "Liquidity_DAPP";
  const [loader, setLoader] = useState(false);
  const [address, setAddress] = useState("");
  const [chainID, setChainID] = useState();

  const [balance, setBalance] = useState();
  const [nativeToken, setNativeToken] = useState();
  const [tokenHolders, setTokenHolders] = useState([]);
  const [tokenSale, setTokenSale] = useState();
  const [currentHolder, setCurrentHolder] = useState();

  const notifyError = (msg) => toast.error(msg, { duration: 4000 });
  const notifySuccess = (msg) => toast.success(msg, { duration: 4000 });

  const connect = async () => {
    try {
      if (!window.ethereum) return notifyError("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]);
      } else {
        notifyError("Sorry, you have No Account");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setChainID(network.chainId);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletConnected = async () => {
    const accounts = await window.ethereum.request({
     method: "eth_accounts",
    });

    return accounts[0];
  };

  const loadTokenDetails = async (token) => {
    try {
      const tokenDetail = await CONNECTING_CONTRACT(token);
      return tokenDetail;
    } catch (error) {
      console.log(error);
    }
  };

  const getPoolAddress = async (token_1, token_2, fee) => {
    try {
      setLoader(true);
      const provider = await web3Provider();
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        provider
      );

      const poolAddress = await factoryContract.getPool(
        token_1.address,
        token_2.address,
        Number(fee)
      );

      const zeroAdd = "0x0000000000000000000000000000000000000000";

      if (poolAddress === zeroAdd) {
        notifySuccess("Sorry, there is no pool");
        setLoader(false);
      } else {
        const poolHistory = {
          token_A: token_1,
          token_B: token_2,
          fee: fee,
          network: token_1.chainId,
          poolAddress: poolAddress,
        };

        let poolArray = JSON.parse(localStorage.getItem("poolHistory")) || [];

        poolArray.push(poolHistory);
        localStorage.setItem("poolHistory", JSON.stringify(poolArray));

        setLoader(false);
        notifySuccess("Successfully Completed");
      }

      return poolAddress;
    } catch (error) {
      const errorMsg = parseErrorMsg(error);
      setLoader(false);
      notifyError(errorMsg);
    }
  };

  const getPoolData = async (poolContract) => {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  };

  const createLiquidity = async (pool, liquidityAmount, approveAmount) => {
    try {
      setLoader(true);
      const address = await checkIfWalletConnected();
      const provider = await web3Provider();
      const signer = provider.getSigner();

      const token_1 = new Token(
        pool.token_A.chainId,
        pool.token_A.address,
        pool.token_A.decimals,
        pool.token_A.symbol,
        pool.token_A.name
      );

      const token_2 = new Token(
        pool.token_B.chainId,
        pool.token_B.address,
        pool.token_B.decimals,
        pool.token_B.symbol,
        pool.token_B.name
      );

      const poolAddress = pool.poolAddress[0];

      const nonfungiblePositionManagerContract = new ethers.Contract(
        positionManagerAddress,
        INonFungiblePositionMangerABI,
        provider
      );

      const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
      );

      const poolData = await getPoolData(poolContract);

      const token_1_token_2_pool = new Pool(
        token_1,
        token_2,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
      );

      const position = new Position({
        pool: token_1_token_2_pool,
        liquidity: ethers.utils.parseUnits(liquidityAmount, 18),
        tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
        tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
      });

      const approveAmount = ethers.utils.parseUnits(approveAmount, 18).toString();

      const tokenContract0 = new ethers.Contract(
        pool.token_A.address,
        ERC20ABI,
        provider
      );

      await tokenContract0.connect(signer).approve(positionManagerAddress, approveAmount);

      const tokenContract1 = new ethers.Contract(
        pool.token_B.address,
        ERC20ABI,
        provider
      );

      await tokenContract1.connect(signer).approve(positionManagerAddress, approveAmount);

      const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts;

      const params = {
        token0: pool.token_A.address,
        token1: pool.token_B.address,
        fee: poolData.fee,
        tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
        tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: amount0Desired.toString(),
        amount1Min: amount1Desired.toString(),
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      };

      const transactionHash = await nonfungiblePositionManagerContract
        .connect(signer)
        .mint(params, { gasLimit: ethers.utils.hexlify(100000) })
        .then((res) => {
          return res.hash;
        });

      if (transactionHash) {
        const liquidityContract = await internalAddLiqudity();

        const addLiquidityData = await liquidityContract
          .connect(signer)
          .addLiquidity(
            pool.token_A.name,
            pool.token_B.name,
            pool.token_A.address,
            pool.token_B.address,
            poolAddress,
            pool.token_B.chainId.toString(),
            transactionHash
          );
        await addLiquidityData.wait();

        setLoader(false);
        notifySuccess("Liquidity add Successfully");
        window.location.reload();
      }
    } catch (error) {
      const errorMsg = parseErrorMsg(error);
      setLoader(false);
      notifyError(errorMsg);
    }
  };

  const fetchInitialData = async () => {
    try {
      const account = await checkIfWalletConnected();
      const balance = await getBalance();

      setBalance(ethers.utils.formatEther(balance.toString()));
      setAddress(account);

      const wooxTokenContract = await internalWooxContract();

      let tokenBalance;
      if (account) {
        tokenBalance = await wooxTokenContract.balanceOf(account);
      } else {
        tokenBalance = 0;
      }

      const tokenName = await wooxTokenContract.name();
      const tokenSymbol = await wooxTokenContract.symbol();
      const tokenTotalSupply = await wooxTokenContract.totalSupply();
      const tokenStandard = await wooxTokenContract.standard();
      const tokenHolders = await wooxTokenContract.userId();
      const tokenOwnerOfContract = await wooxTokenContract.ownerOfContract();
      const tokenAddress = await wooxTokenContract.address;

      const nativeToken = {
        tokenAddress: tokenAddress,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenOwnerOfContract: tokenOwnerOfContract,
        tokenStandard: tokenStandard,
        tokenTotalSupply: ethers.utils.formatEther(tokenTotalSupply.toString()),
        tokenBalance: ethers.utils.formatEther(tokenBalance.toString()),
        tokenHolders: tokenHolders.toNumber(),
      };
      setNativeToken(nativeToken);

      const getTokenHolder = await wooxTokenContract.getTokenHolder();
      setTokenHolders(getTokenHolder);

      if (account) {
        const getTokenHolderData = await wooxTokenContract.getTokenHolderData(
          account
        );

        const currentHolder = {
          tokenId: getTokenHolderData[0].toNumber(),
          from: getTokenHolderData[1],
          to: getTokenHolderData[2],
          totalToken: ethers.utils.formatEther(
            getTokenHolderData[3].toString()
          ),
          tokenHolder: getTokenHolderData[4],
        };

        setCurrentHolder(currentHolder);
      }

      const icoWooxContract = await internalICOWooxContract();
      const tokenPrice = await icoWooxContract.tokenPrice();
      const tokenSold = await icoWooxContract.tokenSold();
      const tokenSaleBalance = await wooxTokenContract.balanceOf(
        "0x58Db7D49D1D619860fc7AF5DCB9ce5CC75c96872"
      );

      const tokenSale = {
        tokenPrice: ethers.utils.formatEther(tokenPrice.toString()),
        tokenSold: tokenSold.toNumber(),
        tokenSaleBalance: ethers.utils.formatEther(
          tokenSaleBalance.toString()
        ),
      };

      setTokenSale(tokenSale);

      const pools = await internalFetchPools();
      setPools(pools);
    } catch (error) {
      notifyError(parseErrorMsg(error));
    }
  };

  const buyToken = async () => {
    setLoader(true);
    try {
      const account = await checkIfWalletConnected();
      const signer = provider.getSigner();

      const wooxTokenContract = await internalWooxContract();

      const transactionHash = await wooxTokenContract
        .connect(signer)
        .buyToken({ value: ethers.utils.parseEther("10000") });

      if (transactionHash) {
        await transactionHash.wait();

        const balance = await wooxTokenContract.balanceOf(account);

        setBalance(ethers.utils.formatEther(balance.toString()));
        setLoader(false);
        notifySuccess("Token purchased Successfully");
      }
    } catch (error) {
      const errorMsg = parseErrorMsg(error);
      setLoader(false);
      notifyError(errorMsg);
    }
  };

  const stakeToken = async () => {
    setLoader(true);
    try {
      const account = await checkIfWalletConnected();
      const signer = provider.getSigner();

      const wooxTokenContract = await internalWooxContract();

      const stakeAmount = ethers.utils.parseEther("1000");

      const transactionHash = await wooxTokenContract
        .connect(signer)
        .approve(
          "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
          stakeAmount
        );

      if (transactionHash) {
        await transactionHash.wait();

        const wooxPoolContract = await internalWooxPoolContract();

        const transactionHashStake = await wooxPoolContract
          .connect(signer)
          .stake(stakeAmount);

        if (transactionHashStake) {
          await transactionHashStake.wait();

          const balance = await wooxTokenContract.balanceOf(account);

          setBalance(ethers.utils.formatEther(balance.toString()));
          setLoader(false);
          notifySuccess("Token staked Successfully");
        }
      }
    } catch (error) {
      const errorMsg = parseErrorMsg(error);
      setLoader(false);
      notifyError(errorMsg);
    }
  };

  const fetchPoolAddress = async (poolId) => {
    try {
      const wooxPoolContract = await internalWooxPoolContract();

      const poolAddress = await wooxPoolContract.poolAddress(poolId);

      return poolAddress;
    } catch (error) {
      notifyError(parseErrorMsg(error));
    }
  };

  const fetchPools = async () => {
    try {
      const pools = await fetchPoolsFromAPI();

      const fetchedPools = pools.map(async (pool) => {
        const poolAddress = await fetchPoolAddress(pool.id);

        return {
          ...pool,
          address: poolAddress,
        };
      });

      const result = await Promise.all(fetchedPools);

      return result;
    } catch (error) {
      notifyError(parseErrorMsg(error));
    }
  };

  const internalWooxContract = async () => {
    const wooxTokenContract = new ethers.Contract(
      wooxTokenAddress,
      WooxToken.abi,
      provider
    );

    return wooxTokenContract;
  };

  const internalICOWooxContract = async () => {
    const wooxICOContract = new ethers.Contract(
      wooxICOAddress,
      WooxICO.abi,
      provider
    );

    return wooxICOContract;
  };

  const internalWooxPoolContract = async () => {
    const wooxPoolContract = new ethers.Contract(
      wooxPoolAddress,
      WooxPool.abi,
      provider
    );

    return wooxPoolContract;
  };

  const internalFetchPools = async () => {
    const pools = await fetchPoolsFromAPI();

    const fetchedPools = pools.map(async (pool) => {
      const poolAddress = await fetchPoolAddress(pool.id);

      return {
        ...pool,
        address: poolAddress,
      };
    });

    const result = await Promise.all(fetchedPools);

    return result;
  };

  return (
    <CONTEXT_Provider
      value={{
        connect,
        getPoolAddress,
        loadTokenDetails,
        notifyError,
        notifySuccess,
        createLiquidity,
        fetchInitialData,
        buyToken,
        tokenSale,
        nativeToken,
        address,
        loader,
        DAPP_NAME,
      }}
    >
      {children}
    </CONTEXT_Provider>
  );
};