import {TinyEmitter} from "tiny-emitter";
import Postmate from "postmate";

interface FloatButton {
    /**
     * 浮动按钮编码，系统预制的编码有： goods (商品购买)
     */
    code: string;
    icon?: string;
    name?: string;
    [key: string]: unknown;
}

interface ConnectOptions {
    /**
     * 页面渲染的容器ID
     */
    container: string
    /**
     * 课堂进入地址
     */
    url: string;
    /**
     * 课堂浮动按钮配置
     */
    floatButtons?: FloatButton[];
    /**
     * 课堂标签页配置
     */
    tabs?: any[];
    /**
     * 预告片
     */
    trailer?: any;
}

export default class ESLiveWebSDK extends TinyEmitter {

    child: any = undefined;

    constructor() {
        super();
        this.insertCss();
    }

    async connect(options: ConnectOptions): Promise<void> {
        return new Promise((resolve, reject) => {

            const container = document.getElementById(options.container);
            if (!container) {
                reject(new Error(`container id '${options.container}' is not exist in page html`));
                return ;
            }

            const handshake = new Postmate({
                container: container,
                url: options.url,
                name: 'live-sdk-iframe',
                classListArray: ["live-sdk-iframe-style"]
            });

            handshake.then(async child => {
                this.child = child;

                child.on("ScreenMode", mode => this.emit("ScreenMode", mode));
                child.on("Goods.Buy", goodsNo => this.emit("Goods.Buy", goodsNo));
                child.on("Goods.Goto", goodsNo => this.emit("Goods.Goto", goodsNo));
                child.on("Reload", () => this.emit("Reload"));
                child.on("Tab.Switch", tab => this.emit("Tab.Switch", tab));

                if (options.floatButtons) {
                    child.call("setFloatButtons", options.floatButtons)
                }

                if (options.tabs) {
                    child.call("setTabs", options.tabs)
                }

                if (options.trailer) {
                    child.call("setTrailer", options.trailer)
                }

                resolve();
            });
        });
    }

    notify(event: string, payload: unknown) {
        if (!this.child) {
            return ;
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
