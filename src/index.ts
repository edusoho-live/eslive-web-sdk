import {TinyEmitter} from "tiny-emitter";
import Postmate from "postmate";

interface ConstructorOptions {
    entryUrl: string;
}

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
     * 课堂ID
     */
    roomId: number;

    /**
     * 课堂Token
     */
    token: string;
    /**
     * 课堂浮动按钮配置
     */
    floatButtons: FloatButton[];
    /**
     * 课堂标签页配置
     */
    tabs: any[];
}

export default class LiveWebSDK extends TinyEmitter {

    entryUrl: string = "//live.edusoho.com";

    child: any = undefined;

    /**
     * @param options.entryUrl
     */
    constructor(options: ConstructorOptions) {
        super();
        if (options.entryUrl) {
            this.entryUrl = options.entryUrl;
        }
        this.insertCss();
    }

    async connect(options: ConnectOptions): Promise<void> {
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