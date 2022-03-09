# Keyboard Minter

## **Getting Started**
1. To start off your going to need a an [Infura key](https://infura.io/) or an [Alchemy key](https://www.alchemy.com/)
   * Sign up and set up a project
   * Then you can paste the key and your account private key in the ```.env``` file (DON'T SHARE OR UPLOAD THESE ANYWHERE!!!!!) 

2. First you want ```cd``` into the parent folder location and use:
```sh
npm i
```

2. Then run the development server:

```sh
npm run dev
```

3. Lastly open ```http:localhost:3000```

## **Deployment And Changes**
Since this uses thirdweb to deploy and monitor the contracts the deployment of the needed contracts are done via scripts.

1. Create a new project with [Thirdweb](https://thirdweb.com/dashboard) and then copy/paste the project address into ```scripts/helpers.js```
```js
const appAddress = '0x7fB83D89FE7354b7147F694dcdC317b3C48F08EA' 
```
2. Add your private key to ```.env```
   
3. From there go through the scripts and paste in the address according to the comments.
   * If you lose any addresses don't worry your projects thirdweb dashboard will keep track of them for you  
   
4. Make sure to also change the asset pictures according to the theme you are going for in your packs.




