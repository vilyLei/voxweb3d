/**
 * TTGameApp
 *
 * 抖音小游戏平台最基础绘制验证。
 * 不依赖引擎任何模块，使用原生 WebGL1 API 绘制一个红色矩形。
 *
 * 在浏览器中运行时，TTMock 会自动模拟 tt 全局对象；
 * 在真机抖音小游戏环境中，tt 原生存在，代码无需改动。
 *
 * 验证目标：
 *   ① tt.createCanvas()          — canvas 创建
 *   ② canvas.getContext("webgl") — WebGL1 上下文获取
 *   ③ 编译 vertex / fragment shader
 *   ④ 上传顶点数据（矩形两个三角形）
 *   ⑤ drawArrays 绘制红色矩形
 *   ⑥ tt.requestAnimationFrame   — 帧循环
 */

// ─── Shader 源码 ─────────────────────────────────────────────────────────────

const VERT_SRC = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("[TTGameApp] shader compile error: " + info);
    }
    return shader;
}

function createProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
    const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw new Error("[TTGameApp] program link error: " + info);
    }
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return program;
}

// ─── 主类 ─────────────────────────────────────────────────────────────────────

export class TTGameApp {

    private m_gl: WebGLRenderingContext = null;
    private m_program: WebGLProgram = null;
    private m_vbo: WebGLBuffer = null;
    private m_running = false;

    initialize(): void {
        console.log("[TTGameApp] initialize() start");

        // 浏览器测试时安装 tt mock；真机上 tt 已存在会自动跳过
        this.installMockIfNeeded();

        const tt = (globalThis as any).tt;
        if (!tt) {
            console.error("[TTGameApp] tt is not available!");
            return;
        }

        // ① 创建 canvas
        const canvas = tt.createCanvas() as any;
        console.log("[TTGameApp] canvas:", canvas.width, "x", canvas.height);

        // ② 获取 WebGL1 上下文
        const gl = canvas.getContext("webgl", {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: true
        }) as WebGLRenderingContext;

        if (!gl) {
            console.error("[TTGameApp] WebGL1 context creation failed!");
            return;
        }
        console.log("[TTGameApp] WebGL1 context OK");
        this.m_gl = gl;

        // ③ 编译 shader / 链接 program
        this.m_program = createProgram(gl, VERT_SRC, FRAG_SRC);
        console.log("[TTGameApp] shader program OK");

        // ④ 上传顶点数据：NDC 坐标，矩形覆盖中央 [-0.5, 0.5] 区域
        //    两个三角形（triangle-strip 顺序）
        //    (-0.5, 0.5) --- (0.5, 0.5)
        //        |       \       |
        //    (-0.5,-0.5) --- (0.5,-0.5)
        const vertices = new Float32Array([
            -0.5,  0.5,   // 左上
            -0.5, -0.5,   // 左下
             0.5,  0.5,   // 右上
             0.5, -0.5,   // 右下
        ]);

        this.m_vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // ⑥ 启动帧循环
        // 抖音小游戏：requestAnimationFrame 是全局函数，不在 tt 上
        // 浏览器 mock：tt.requestAnimationFrame 代理 window.requestAnimationFrame
        const raf: (cb: FrameRequestCallback) => void =
            typeof (globalThis as any).requestAnimationFrame === 'function'
                ? (cb) => (globalThis as any).requestAnimationFrame(cb)
                : (cb) => tt.requestAnimationFrame(cb);

        this.m_running = true;
        const loop = (): void => {
            if (!this.m_running) return;
            this.render();
            raf(loop);
        };
        raf(loop);

        console.log("[TTGameApp] initialize() done, render loop started");
    }

    private render(): void {
        const gl = this.m_gl;
        if (!gl) return;

        // 清屏（深蓝背景，方便看出红色矩形）
        gl.clearColor(0.05, 0.05, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // ⑤ 绘制红色矩形
        gl.useProgram(this.m_program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_vbo);
        const loc = gl.getAttribLocation(this.m_program, "a_position");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    run(): void {
        // 渲染循环由内部 tt.requestAnimationFrame 驱动
    }

    destroy(): void {
        this.m_running = false;
        const gl = this.m_gl;
        if (gl) {
            if (this.m_vbo) gl.deleteBuffer(this.m_vbo);
            if (this.m_program) gl.deleteProgram(this.m_program);
        }
        this.m_gl = null;
        this.m_program = null;
        this.m_vbo = null;
    }

    // ─── 浏览器下安装 tt mock ──────────────────────────────────────────────────

    private installMockIfNeeded(): void {
        if (typeof (globalThis as any).tt !== "undefined") {
            console.log("[TTGameApp] tt already exists, skip mock.");
            return;
        }
        // 最小化内联 mock，无需依赖 TTMock.ts
        const mock = {
            createCanvas(): any {
                const c = document.createElement("canvas");
                c.width = window.screen.width;
                c.height = window.screen.height;
                c.style.position = "fixed";
                c.style.left = "0";
                c.style.top = "0";
                c.style.width = "100%";
                c.style.height = "100%";
                document.body.style.margin = "0";
                document.body.style.padding = "0";
                document.body.style.overflow = "hidden";
                document.body.style.background = "#000";
                document.body.appendChild(c);
                console.log("[TTGameApp mock] createCanvas:", c.width, "x", c.height);
                return c;
            },
            getSystemInfoSync() {
                return {
                    windowWidth: window.screen.width,
                    windowHeight: window.screen.height,
                    pixelRatio: window.devicePixelRatio || 1
                };
            },
            requestAnimationFrame(cb: FrameRequestCallback): void {
                window.requestAnimationFrame(cb);
            }
        };
        (globalThis as any).tt = mock;
        console.log("[TTGameApp] tt mock installed for browser testing.");
    }
}

export default TTGameApp;

// 自动启动 — 直接内联到小游戏 game.js 时无需额外调用
// 浏览器 dev 模式下由 main.ts 调用 initialize()，此处不重复执行
if (typeof (globalThis as any).tt !== "undefined") {
    // 真机：tt 已存在，直接启动
    const _app = new TTGameApp();
    _app.initialize();
}
