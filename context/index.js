export const CONTEXT_Provider = ({ children }) => {

 
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