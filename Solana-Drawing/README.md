# Solana Drawing

## Setup
1. [`Install rust`](https://www.rust-lang.org/tools/install)
2. [`Install Solana CLI`](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)
3. Generate a new keygen:
```sh
solana-keygen new
```

4. Config your solana to use localhost
```sh
solana config set --url localhost
```

5. [`Install Yarn`](https://yarnpkg.com/getting-started/install)
6. [`Install Anchor`](https://www.anchor-lang.com/docs/installation#anchor)
7. Install dependencys:
```sh
npm install
```

8. Start a local network
```sh
solana-test-validator
```

9. Deploy your program and you'll get your program ID save it for next step
```sh
anchor deploy
```

10. Add your program ID to `lib.rs` and `index.tsx` respectively
```
declare_id!("Your_Program_ID");

const programId = new PublicKey("your-program-id");
```


11. Then run
```sh
anchor build
```

12. Redeploy it
```sh
anchor deploy
```

13. Start your app
```sh
npm run dev
```