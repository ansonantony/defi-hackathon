import React from "react";

const SuccessPool = ({poolAddress}) => {

  
  return <>
    <Input value={`${poolAddress}`} />
    <button
    onClick={(e)=>navigator.clipboard.writeText(poolAddress)}
    className="btn btn--large btn--green-light btn--with-icon btn--icon-right full-width"  >
    Copy Pool Address
    </button>
    <svg className="woox-icon icon-arrow-right">
      <use xlinkHref="#icon-arrow-right"></use>
    </svg>
  </>;
};

export default SuccessPool;
