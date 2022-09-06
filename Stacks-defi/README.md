## Getting Started
1. Customize the contracts/frontend to your liking 
2. Add your private testnet mnemonic into the `Testnet.toml`
3. `cd` into `./defi-contracts` and create a deployment plan:
```sh
clarinet deployments generate --testnet
```
4. Now deploy
```sh
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```
5. Add your `contractOwnerAddress` in `../lib/constants.ts`
6. `cd` into `./frontend` run `npm install`
7. Finally run `npm run dev`