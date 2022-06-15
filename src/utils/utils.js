export function truncate(input) {
    return input.substring(0, 5) + '...' + input.substring(38);
};

export function updateNetwork(chainId){
    if(chainId === " ") {
      return;
    }

    if(chainId === "0x4") {
      return ("Rinkeby Test Network")
    } else if(chainId === "0x1") {
      return ("ETH Mainnet")
    } else if(chainId === "0x2a") {
      return ("Kovan Test Network")
    }else if(chainId === "0x3") {
      return ("Ropsten Test Network")
    } else {
      return ("Unsupported")
    }
  }