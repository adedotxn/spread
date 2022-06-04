const { ethers } = require("hardhat");
const fs = require('fs')

const contractName = "Spread"

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  const contractFactory = await ethers.getContractFactory(contractName)

  const contract = await contractFactory.deploy()

  const address = JSON.stringify({
    "contractAddress": contract.address,
  })

  console.log("Contract address is : ", contract.address)
  console.log("Deployer address is : ", deployer.address)

  await contract.deployed()
  const abi = fs.readFileSync(`src/artifacts/contracts/${contractName}.sol/${contractName}.json`);

  // await fs.mkdir('.src/contracts', { recursive: true }, (err) => {
    // if (err) throw err;
  // });

  fs.writeFileSync('./src/contracts/abi.json', abi);
  fs.writeFileSync('./src/contracts/contract_address.json', address)

}

const runMain = async () => {
    try {
      await main()
      process.exit(0)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
}
  
runMain()