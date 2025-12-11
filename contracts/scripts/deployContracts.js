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

  console.log("Transferring ownership of UserRegistry to GlobalRegistry contract");
  userRegistry.transferOwnership(globalRegistryAddress);

  // Wait for a few block confirmations
  // console.log("Waiting for block confirmations...");
  // await globalRegistry.deploymentTransaction().wait(6);

  // Verify on Etherscan
  // if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
  //   console.log("Verifying contract on Etherscan...");
  //   try {
  //     await hre.run("verify:verify", {
  //       address: address,
  //       constructorArguments: [],
  //     });
  //     console.log("Contract verified!");
  //   } catch (error) {
  //     console.log("Verification failed:", error.message);
  //   }
  // }

  return globalRegistryAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });