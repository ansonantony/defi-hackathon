import React, {useState,useEffect} from "react";
import { ethers, Contract} from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.json";

import toast from "react-hot-toast";
import {Token} from "@uniswap/sdk-core";
import {Pool,Position,nearestUsableTick} from "@uniswap/v3-sdk";
import { abi as IUniswapV3PoolABI} from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as INonFungiblePositionMangerABI} from "@uniswap/v3-core/artifacts/contracts/interfaces/INonFungiblePositionManger.sol/INonFungiblePositionManger.json";

import ERC20ABI from "./abi.json";

import {
    ERC20_ABI,TOKEN_ABI,V3_SWAP_ROUTER_ADDRESS,CONNECTING_CONTRACT,FACTORY_ABI,FACTORY_ADDRESS,web3Provider,positionManagerAddress,internalWooxContract,internalICOWooxContract,internalAddLiqudity,getBalance,
}
from "./constants";


export const CONTEXT = React.createContext();


export const CONTEXT_Provider = ({ children }) => {

    const DAPP_NAME = "Liquidity_DAPP";
    const [loader,setLoader] = useState(false);
    const [address,setAddress] = useState("");
    const [chainID,setChainID] = useState();

    const [balance,setBalance] = useState();
    const [nativeToken,setNativeToken] = useState();
    const [tokenHolders,setTokenHolders] = useState([]);
    const [tokenSale,setTokenSale] = useState();    
    const [currentHolder,setCurrentHolder] = useState();

    const notifyError = (msg) => toast.error(msg,{duration: 4000});
    const notifySuccess = (msg) => toast.success(msg, {duration: 4000});

    const connect = async() =>{
        try
        {
            if(!window.ethereum) return notifyError("Install MetaMask");
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if(accounts.length)
            {
                setAddress(accounts[0]);
            }
            else
            {
                notifyError("Sorry, you have No Account");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const newtork = await provider.getNetwork();
            setChainID(newtork.chainId);
        }
        catch(error)
        {
            console.log(error);
        }
    };


    const checkIfWalletConnected = async () =>{
        const accounts = await window.ethereum.request(
            {
                method: "eth_accounts",
            }
        );

        return acconts[0];
    };


    const LOAD_TOKEN = async (token) =>{
        try{
            const tokenDetail = await CONNECTING_CONTRACT(token);
            return tokenDetail;
        }
        catch(error)
        {
            console.log(error);
        }
    };

    
    const GET_POOL_ADDRESS = await (token_1,token_2,fee) =>{
        try
        {
            setLoader(true);
            const PROVIDER = await web3Provider();

            const factoryContract = new ethers.Contract{
                FACTORY_ADDRESS,
                FACTORY_ABI,
                PROVIDER
            };

            const poolAddress = await factoryContract.functions.getPool{
                token_1.address,
                token_2.address,
                Number(fee)
            };

            const poolHistory = {
                token_A: token_1,
                token_B: token_2,
                fee: fee,
                network: token_1.chainIdm
                poolAddress: poolAddress,
            };

            const zeroAdd = "0x000000000000000000000000000000000000000"

            if (poolAddress == zeroAdd)
                {
                    notifySuccess("Sorry there is no pool");
                }
        }   else
            {
                let poolArray
            }
    }

 
    return(
        <CONTEXT_Provider
        value = {{
            connect,
            GET_POOL_ADDRESS,
            LOAD_TOKEN,
            notifyError,
            notifySuccess,
            CREATE_LIQUIDITY,
            GET_ALL_LIQUIDITY,
            transferNativeToken,
            buyToken,
            tokenSale,
            nativeToken,
            address,
            loader,
            DAPP_NAME,
        }}
        />
    );
}