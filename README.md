# EduSoho 大班课直播 Web SDK

[![Npm package](https://img.shields.io/npm/v/@codeages/livecloud-web-sdk)](https://www.npmjs.com/package/@codeages/livecloud-web-sdk)

## 快速开始

### 安装

```bash
npm i @codeages/livecloud-web-sdk
// or
yarn add @codeages/livecloud-web-sdk
```

### 使用

```javascript
import LiveWebSDK from '@codeages/livecloud-web-sdk';

async function initSdk() {
    const sdk = new LiveWebSDK({
        entryUrl: '//live-dev.edusoho.cn', // 仅测试环境时需传入此参数，正式环境不需要此参数
    });

    sdk.on("Goods.Buy", (goodsNo) => {
        console.log("Event[Goods.Buy] goods no ", goodsNo);

        // 模拟支付完成后，回调
        setTimeout(() => {
            sdk.notify("Goods.Paid", {no: "G1001", goto: "//www.edusoho.com"});
        }, 3000);
    });

    await sdk.connect({
        roomId: 12345,
        token: "a jwt token",
        floatButtons: [
            {
                code: "goods",
                goods: [
                    {no: "G1001", name: "测试商品1", price: 12350, picture: "//test-1.jpg", description: "这个商品的描述<b>支持HTML</b>"},
                    {no: "G1002", name: "测试商品2", price: 12350, picture: "//test-2.jpg", description: "这个商品的描述<b>支持HTML</b>"}
                ]
            }
        ],
    });
}

initSdk();
```