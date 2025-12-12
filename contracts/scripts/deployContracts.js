const hre = require("hardhat");

async function main() {
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Deploying UserRegistry...");
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy(
    deployer.address,
    'dummy'
  );

  await userRegistry.waitForDeployment();

  const userRegistryImplAddress = await userRegistry.getAddress();
  console.log("UserRegistry deployed to:", userRegistryImplAddress);


  console.log("Deploying GlobalRegistry...");

  const GlobalRegistry = await hre.ethers.getContractFactory("GlobalRegistry");
  const globalRegistry = await GlobalRegistry.deploy(userRegistryImplAddress);

  await globalRegistry.waitForDeployment();

  const globalRegistryAddress = await globalRegistry.getAddress();
  console.log("GlobalRegistry deployed to:", globalRegistryAddress);

  const startingRegistryOwner = await userRegistry.owner();
  console.log("The initial UserRegistry owner is ", startingRegistryOwner);
  console.log("Transferring ownership of UserRegistry to GlobalRegistry contract");
  await userRegistry.transferOwnership(globalRegistryAddress);
  console.log("Ownership transferred!");
  const registryOwner = await userRegistry.owner();
  console.log("The new UserRegistry owner is ", registryOwner)

  return globalRegistryAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });