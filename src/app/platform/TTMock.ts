/**
 * TTMock - Web browser simulation of the TikTok (Douyin) Mini-Game 'tt' global API.
 *
 * Usage: import and call TTMock.install() before any game initialization.
 * This installs a global 'tt' object that behaves like the Douyin Mini-Game runtime,
 * allowing the same mini-game bootstrap code to run in a desktop browser for testing.
 */

interface TTSystemInfo {
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    pixelRatio: number;
    platform: string;
    system: string;
}

interface TTCanvas {
    width: number;
    height: number;
    getContext(type: string, attr?: any): any;
    addEventListener(type: string, handler: any, capture?: boolean): void;
    removeEventListener(type: string, handler: any, capture?: boolean): void;
    toDataURL(type?: string): string;
    style?: any;
}

interface TTEnv {
    createCanvas(): TTCanvas;
    getSystemInfoSync(): TTSystemInfo;
    requestAnimationFrame(callback: (timestamp: number) => void): number;
    cancelAnimationFrame(id: number): void;
    onTouchStart(callback: (res: any) => void): void;
    onTouchMove(callback: (res: any) => void): void;
    onTouchEnd(callback: (res: any) => void): void;
    onTouchCancel(callback: (res: any) => void): void;
}

class TTMockImpl implements TTEnv {

    private m_mainCanvas: HTMLCanvasElement = null;

    /**
     * createCanvas() — simulates tt.createCanvas()
     * Creates an absolutely positioned canvas and appends it to document.body,
     * mimicking the mini-game main canvas behavior.
     */
    createCanvas(): TTCanvas {
        const sysInfo = this.getSystemInfoSync();
        const canvas = document.createElement("canvas") as HTMLCanvasElement;

        // logical size (CSS pixels)
        canvas.style.display = "block";
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        canvas.style.width = sysInfo.windowWidth + "px";
        canvas.style.height = sysInfo.windowHeight + "px";
        canvas.style.zIndex = "1";

        // physical size (device pixels)
        canvas.width = sysInfo.screenWidth;
        canvas.height = sysInfo.screenHeight;

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.background = "#000";
        document.body.appendChild(canvas);

        this.m_mainCanvas = canvas;
        return canvas as TTCanvas;
    }

    /**
     * getSystemInfoSync() — simulates tt.getSystemInfoSync()
     */
    getSystemInfoSync(): TTSystemInfo {
        const dpr = window.devicePixelRatio || 1.0;
        const w = window.innerWidth;
        const h = window.innerHeight;
        return {
            screenWidth: Math.round(w * dpr),
            screenHeight: Math.round(h * dpr),
            windowWidth: w,
            windowHeight: h,
            pixelRatio: dpr,
            platform: "web-mock",
            system: navigator.userAgent
        };
    }

    /**
     * requestAnimationFrame — same as window.requestAnimationFrame
     */
    requestAnimationFrame(callback: (timestamp: number) => void): number {
        return window.requestAnimationFrame(callback);
    }

    /**
     * cancelAnimationFrame — same as window.cancelAnimationFrame
     */
    cancelAnimationFrame(id: number): void {
        window.cancelAnimationFrame(id);
    }

    /**
     * Touch event simulation using mouse events on the main canvas.
     * Converts MouseEvent coordinates to touch-like format { touches: [{clientX, clientY}] }
     */
    onTouchStart(callback: (res: any) => void): void {
        this.bindMouseEvent("mousedown", callback);
        // also bind real touch for mobile browser testing
        this.bindTouchEvent("touchstart", callback);
    }

    onTouchMove(callback: (res: any) => void): void {
        this.bindMouseEvent("mousemove", callback);
        this.bindTouchEvent("touchmove", callback);
    }

    onTouchEnd(callback: (res: any) => void): void {
        this.bindMouseEvent("mouseup", callback);
        this.bindTouchEvent("touchend", callback);
    }

    onTouchCancel(callback: (res: any) => void): void {
        this.bindTouchEvent("touchcancel", callback);
    }

    private bindMouseEvent(evtType: string, callback: (res: any) => void): void {
        const target = this.m_mainCanvas || window;
        target.addEventListener(evtType, (evt: MouseEvent) => {
            callback({
                touches: [{ clientX: evt.clientX, clientY: evt.clientY }],
                changedTouches: [{ clientX: evt.clientX, clientY: evt.clientY }]
            });
        });
    }

    private bindTouchEvent(evtType: string, callback: (res: any) => void): void {
        const target = this.m_mainCanvas || window;
        target.addEventListener(evtType, (evt: TouchEvent) => {
            const touches = Array.from(evt.touches).map(t => ({
                clientX: t.clientX,
                clientY: t.clientY
            }));
            const changed = Array.from(evt.changedTouches).map(t => ({
                clientX: t.clientX,
                clientY: t.clientY
            }));
            callback({ touches, changedTouches: changed });
        });
    }
}

/**
 * Install the tt mock into the global scope.
 * Call this once at the top of your mini-game entry file when running in browser.
 *
 * Example:
 *   import TTMock from './platform/TTMock';
 *   TTMock.install();
 *
 *   const canvas = tt.createCanvas();  // works in both browser and Douyin
 */
export class TTMock {
    static install(): void {
        if (typeof (window as any).tt === "undefined") {
            (window as any).tt = new TTMockImpl();
            console.log("[TTMock] Douyin tt API mock installed for browser testing.");
        } else {
            console.log("[TTMock] tt already exists, skip mock installation.");
        }
    }
}

export default TTMock;
