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
                    {
                        no: "G1001", 
                        name: "测试商品1", 
                        price: 12350, 
                        picture: "//test-1.jpg", 
                        // 商品描述支持富文本编辑器 ckeditor 4 / ckeditor 5 / tinymce 的默认样式
                        // 以 ckeditor 5 为例，传入<div class="ck-content”>....这里是商品介绍....</div>
                        // 其他自定义样式，传入 <style></style> 标签即可
                        description: "这个商品的描述<b>支持HTML</b>",  
                        paid: false, // 是否已支付，默认 false，未支付
                        goto: true, // 是否显示 goto 按钮，默认 true，显示
                        gotoText: '去查看' // 跳转按钮的文案， 默认 '去查看'
                    },
                    {
                        no: "G1002", 
                        name: "测试商品2", 
                        price: 12350, 
                        picture: "//test-2.jpg", 
                        description: "这个商品的描述<b>支持HTML</b>"
                    }
                ]
            }
        ],
        tabs: [
            {code: "desc", name: "介绍", content: "这里是介绍的具体内容描述<b>支持HTML</b>"},
            {code: "chat", name: "互动"},
            {code: "rank", name: "排行榜", dataUrl: "//data-url"},
        ]
    });
}

initSdk();
```

### 排行榜数据格式
```json
{
    "invite":{
        "uid":444,
        "uname":"mememem",
        "avatar":"https://img.yzcdn.cn/vant/cat.jpeg",
        "link":"https://share-url",
        "image":"https://share-image-url.png"
    },
    "ranks":[
        {
            "seq":1,
            "uid":111,
            "uname":"第一",
            "avatar":"https://img.yzcdn.cn/vant/cat.jpeg",
            "invited":33
        },
        {
            "seq":2,
            "uid":123,
            "uname":"第二",
            "avatar":"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            "invited":30
        },
        {
            "seq":3,
            "uid":333,
            "uname":"第三三",
            "avatar":"https://img.yzcdn.cn/vant/cat.jpeg",
            "invited":20
        },
        {
            "seq":4,
            "uid":13,
            "uname":"四",
            "avatar":"",
            "invited":10
        }
    ]
}
```