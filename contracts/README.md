# Registries

```shell
npx hardhat help
npx hardhat test
npx hardhat compile
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

To set up the contracts, first run
```shell
npx hardhat compile
npx hardhat node
```

In a new terminal window run
```shell
npx hardhat run scripts/deployContracts.js --network localhost
```

Example to make a UserContract after deployment
```shell
npx hardhat console --network localhost
> const GlobalRegistry = await ethers.getContractAt('GlobalRegistry', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')
> await GlobalRegistry.createNewRegistry('author_name')
```
