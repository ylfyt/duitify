if(!self.define){let e,r={};const i=(i,c)=>(i=new URL(i+".js",c).href,r[i]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=r,document.head.appendChild(e)}else e=i,importScripts(i),r()})).then((()=>{let e=r[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,a)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(r[s])return;let o={};const b=e=>i(e,s),n={module:{uri:s},exports:o,require:b};r[s]=Promise.all(c.map((e=>n[e]||b(e)))).then((e=>(a(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.svg",revision:"77b56fee377ae76286d49e21536e178d"},{url:"accounts/bca.webp",revision:"4c1a1a95710549e555dfbf11d0080e2e"},{url:"accounts/bri.webp",revision:"18e5da6f0cf7551f3c0ccc953662d057"},{url:"accounts/dana.webp",revision:"794a1b30cdebde07eb19e2d64195bf26"},{url:"accounts/gopay.webp",revision:"db72c66b2fabfd0e29952862a797a1b5"},{url:"accounts/invest.webp",revision:"cf98cf21a286b756346c20fdf62ff0ee"},{url:"accounts/loan.webp",revision:"5612aa8e588afb7ae712f66e068cb5a8"},{url:"accounts/ovo.webp",revision:"bb7ce3909587b00de2ce6d381e5b4c44"},{url:"accounts/shopee.webp",revision:"c0e4868e7f07479ef1b9b527ea05c77b"},{url:"accounts/wallet.webp",revision:"804ab7a15bf79ec8cdfc19fcab233f04"},{url:"assets/browser-DK_wqz6m.js",revision:null},{url:"assets/index-B5us3sro.js",revision:null},{url:"assets/index-T9u4rC0B.css",revision:null},{url:"categories/bill.webp",revision:"99ed7e46b2d19c8a6f8a111d2fb35668"},{url:"categories/coupon.webp",revision:"b3ec3c5058136d5d3f4b3b5b4b1df555"},{url:"categories/education.webp",revision:"2bc5dbb0a9c70b85d569eb3cf7c8a13a"},{url:"categories/food.webp",revision:"98a94392c3db6508011f7b311b80c215"},{url:"categories/future.webp",revision:"9f97b6e61f98a9842e0282c1dcc2338a"},{url:"categories/grants.webp",revision:"1e89ed8caa703689f2f7115cd92a289f"},{url:"categories/health.webp",revision:"c0237b27c69fc39ff7f00b00021b3384"},{url:"categories/insurance.webp",revision:"0f1f2a084094e22339d5fd689ba1f3bd"},{url:"categories/internet.webp",revision:"c1f88ae9b9e4ea1583014b404ace70bc"},{url:"categories/invest.webp",revision:"4f480c10b8f2051d58ac7500d92f671f"},{url:"categories/laundry.webp",revision:"3788dbcdec6a5a87fe2f48eecdc2b959"},{url:"categories/refund.webp",revision:"30327cfa313f1ef0555dc3aa12c8123d"},{url:"categories/rent.webp",revision:"faa22d74e11ce12a139b582606e787c9"},{url:"categories/reward.webp",revision:"6f4d0982657c70efca3823effe7fc9ab"},{url:"categories/salary.webp",revision:"32cc5455558e58e2cf23262a6e404c24"},{url:"categories/shopping.webp",revision:"fad034a32bc2f898d8ce39e64207fc29"},{url:"categories/snack.webp",revision:"6ef0d582caf8fabfa1d62a4c41303bd4"},{url:"categories/social.webp",revision:"3ac5a1fe47e247eb18ea7305d14323ac"},{url:"categories/sport.webp",revision:"90595b2b3f4a59121ac3615403825230"},{url:"categories/subscription.webp",revision:"465aa768f96d43706db20322c8be9be8"},{url:"categories/support.webp",revision:"ff0b7e000f7d46a747b8f49d74be2aed"},{url:"categories/tax.webp",revision:"b8e9d64225c77ce82f66733e94d6059a"},{url:"categories/transfer.webp",revision:"bda6eb5393c838c8bab96e007e5da307"},{url:"categories/transportation.webp",revision:"a73b0bcb485ecda85541590a0e9113b3"},{url:"error.svg",revision:"9a44d6ee6a100c3722cc42528dbe13b2"},{url:"icons/icon-192x192.png",revision:"28913a24302cd54d2fa9dfc8e50c0954"},{url:"icons/icon-512x512.png",revision:"8e3ff3cb023eb82ef879aa0e71f66910"},{url:"index.html",revision:"e80cd3b5c16369f2fd5665dc84f6579d"},{url:"registerSW.js",revision:"91f2849ddd1c876834ae749eaeaa8a94"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"manifest.webmanifest",revision:"a3007b811b068f1b01e782824adf86bc"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));