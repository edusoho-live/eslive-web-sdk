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

    // 监听屏幕方向变更事件
    // mode 的值有 portrait (竖屏)、landscape (横屏)、fake-landscape (假横屏，通过CSS transform 旋转)
    // CSS: .fake-landscape {transform-origin: top left; transform: rotate(90deg) translate(0, -100vmin);}
    sdk.on("ScreenMode", (mode) => {
        console.log("Event[ScreenMode]", mode);
    });

    // 监听点击购买事件
    sdk.on("Goods.Buy", (goodsNo) => {
        console.log("Event[Goods.Buy] goods no ", goodsNo);
        // 购买支付流程成功后 调用 notify
        sdk.notify("Goods.Paid", {no: "G1001", goto: "//www.edusoho.com"});
    });

    // 监听点击购买成功后的去学习事件
    sdk.on("Goods.Goto", (goodsNo) => {
        console.log("Event[Goods.Goto] goods no ", goodsNo);
        //const goto = generateGoodsGotoUrl(goodsNo);
        const goto = "//github.com/?goodsNo=" + goodsNo;
        window.location.href = goto;
    });

    await sdk.connect({
        roomId: 12345,
        token: "a jwt token",
        floatButtons: [
            {
                code: "goods",
                goods: [
                    {no: "G1001", name: "测试商品1", price: 12350, picture: "//test-1.jpg", description: "这个商品的描述<b>支持HTML</b>", paid: true},
                    {no: "G1002", name: "测试商品2", price: 12350, picture: "//test-2.jpg", description: "这个商品的描述<b>支持HTML</b>"}
                ]
            }
        ],
    });
}

initSdk();
```