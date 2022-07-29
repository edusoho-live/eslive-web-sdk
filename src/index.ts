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
    /**
     * 水印
     */
    watermark?: string;
}

export default class ESLiveWebSDK extends TinyEmitter {

    child: any = undefined;

    async connect(options: ConnectOptions): Promise<void> {
        console.log("ESLiveWebSDK v1.3.2");

        return new Promise((resolve, reject) => {

            const container = document.getElementById(options.container);
            if (!container) {
                reject(new Error(`container id '${options.container}' is not exist in page html`));
                return ;
            }

            const handshake = new Postmate({
                container: container,
                url: options.url,
                name: 'live-sdk-iframe'
            });

            const frame = container.getElementsByTagName("iframe")[0];

            frame.allowFullscreen=true;
            frame.allow = "microphone; camera; screen-wake-lock; display-capture";
            frame.scrolling = "no";
            frame.style.position = "absolute";
            frame.style.left = "0";
            frame.style.top = "0";
            frame.style.right = "0";
            frame.style.bottom = "0";
            frame.style.height = "100%";
            frame.style.width = "100%";
            frame.style.border = "0px";
            frame.style.overflow = "hidden";

            handshake.then(async child => {
                this.child = child;

                child.on("ScreenMode", mode => this.emit("ScreenMode", mode));
                child.on("Goods.Buy", goodsNo => this.emit("Goods.Buy", goodsNo));
                child.on("Goods.Goto", goodsNo => this.emit("Goods.Goto", goodsNo));
                child.on("Reload", () => this.emit("Reload"));
                child.on("Tab.Switch", tab => this.emit("Tab.Switch", tab));
                child.on("watch-time-update", rate => this.emit("watch-time-update", rate));
                child.on("watch-start", () => this.emit("watch-start"));
                child.on("watch-ended", () => this.emit("watch-ended"));

                if (options.floatButtons) {
                    child.call("setFloatButtons", options.floatButtons)
                }

                if (options.tabs) {
                    child.call("setTabs", options.tabs)
                }

                if (options.trailer) {
                    child.call("setTrailer", options.trailer)
                }

                if (options.watermark) {
                    child.call("setWatermark", options.watermark)
                }

                resolve();
            });
        });
    }

    pause(): void {
        this.notify("pause", null);
    }

    play(): void {
        this.notify("play", null);
    }

    notify(event: string, payload: unknown) {
        if (!this.child) {
            return ;
        }
        this.child.call(event, payload);
    }
}
