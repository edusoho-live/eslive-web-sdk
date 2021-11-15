import {TinyEmitter} from "tiny-emitter";
import Postmate from "postmate";

export default class LiveSDK extends TinyEmitter {

    entryUrl = "//live.edusoho.com";

    child = undefined;

    /**
     * @param options.entryUrl
     */
    constructor(options) {
        super();
        if (options.entryUrl) {
            this.entryUrl = options.entryUrl;
        }
        this.insertCss();
    }

    /**
     * 连接直播课堂
     *
     * @param {Number} options.roomId 课堂ID
     * @param {String} options.token 课堂登录Token
     * @param {String} options.container 页面渲染根节点
     * @param {String} options.floatButtons 课堂浮动按钮
     * @param {String} options.tabs 课堂标签
     */
    async connect(options) {
        console.log("SDK parent, enter");
        return new Promise((resolve, reject) => {
            const url = this.entryUrl + "/h5/room/" + options.roomId + "/enter?token=" + options.token;

            const handshake = new Postmate({
                container: document.getElementById(options.container),
                url: url,
                name: 'live-sdk-iframe',
                classListArray: ["live-sdk-iframe-style"]
            });

            handshake.then(async child => {
                this.child = child;

                child.on("Goods.Buy", goodsNo => this.emit("Goods.Buy", goodsNo));

                if (options.floatButtons) {
                    child.call("setFloatButtons", options.floatButtons)
                }

                if (options.tabs) {
                    child.call("setTabs", options.tabs)
                }

                resolve();
            });
        });
    }

    notify(event, payload) {
        if (!this.child) {
            return;
        }
        this.child.call(event, payload);
    }

    insertCss() {
        const styles = '.live-sdk-iframe-style {border: none;width: 100%;height: 100%;}';
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
}
