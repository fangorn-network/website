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

After deployment of the UserContract impl and GlobalRegistry, you can start a terminal session via
```shell
npx hardhat console --network localhost
```

Once in the console session, you can obtain a reference to the GlobalRegistry
```shell
const GlobalRegistry = await ethers.getContractAt('GlobalRegistry', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')
```

To deploy your own UserRegistry you can then run
```shell
await GlobalRegistry.createNewRegistry('author_name')
```
To get your UserRegistry's address (assuming there is only one) run
```shell
await GlobalRegistry.getUserRegistries(1)
```
You can now retrieve your UserRegistry using the address printed to the console
```shell
const MyRegistry = await ethers.getContractAt('UserRegistry', '0xCafac3dD18aC6c6e92c921884f9E4176737C052c')

```

