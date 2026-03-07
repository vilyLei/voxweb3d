/**
 * DemoContextMock
 *
 * 验证目标：
 *   在 Web 浏览器中模拟抖音小游戏 tt API，
 *   通过 TTMock 注入 canvas，绕过引擎的 DOM/div 初始化路径，
 *   验证引擎核心渲染管线在非 DOM 环境下能正常工作。
 *
 * 对应改造点：
 *   ① TTMock.install()        — 模拟 tt 全局对象（已实现）
 *   ② RendererParam.injectCanvas() — 无 div，canvas 注入参数（已实现）
 *   ③ RAdapterContext else 分支  — canvas 注入路径（已实现）
 */

import TTMock from "../app/platform/TTMock";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Vector3D from "../vox/math/Vector3D";
import IRendererScene from "../vox/scene/IRendererScene";

export class DemoContextMock {

    private m_rscene: IRendererScene = null;
    private m_box: Box3DEntity = null;
    private m_rotY = 0.0;
    private m_running = false;

    constructor() {}

    initialize(): void {
        console.log("DemoContextMock::initialize() ......");

        // 绕过域名白名单验证（本地开发/小游戏平台均需要）
        (window as any).VoxVerify = { isEnabled: () => true };

        // ① 安装 tt mock（浏览器中生效，真机上自动跳过）
        TTMock.install();

        const tt = (window as any).tt;

        // ② 获取系统信息（对齐抖音小游戏 API）
        const sysInfo = tt.getSystemInfoSync();
        console.log("[DemoContextMock] sysInfo:", sysInfo);

        // ③ 创建 canvas（对齐抖音小游戏 API）
        const canvas = tt.createCanvas();
        console.log("[DemoContextMock] canvas size:", canvas.width, "x", canvas.height);

        // ④ 引擎全局配置
        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

        // ⑤ 创建渲染参数（小游戏路径，无 div，注入 canvas）
        const rparam = new RendererParam();
        rparam.autoSyncRenderBufferAndWindowSize = false;
        rparam.autoAttachingHtmlDoc = false;
        rparam.sysEvtReceived = false;
        rparam.syncBgColor = false;
        rparam.hideWindowFrame = false;
        rparam.divW = sysInfo.windowWidth;
        rparam.divH = sysInfo.windowHeight;
        rparam.maxWebGLVersion = 1;   // 小游戏只支持 WebGL1
        rparam.setCamProject(45.0, 10.0, 9000.0);
        rparam.setCamPosition(800.0, 800.0, 800.0);
        rparam.setCamLookAtPos(0.0, 0.0, 0.0);
        // 注入 canvas，引擎初始化时走非 DOM 路径
        rparam.injectCanvas(canvas, sysInfo.pixelRatio);

        // ⑥ 初始化渲染场景
        const rscene = new RendererScene();
        rscene.initialize(rparam).setAutoRunning(false);
        rscene.updateCamera();
        this.m_rscene = rscene;

        // ⑦ 添加测试物体：坐标轴 + 旋转立方体
        const axis = new Axis3DEntity();
        axis.initialize(400.0);
        rscene.addEntity(axis);

        const box = new Box3DEntity();
        box.initialize(
            new Vector3D(-100, -100, -100),
            new Vector3D(100, 100, 100),
            null   // 无纹理，纯色
        );
        box.setXYZ(0, 0, 0);
        rscene.addEntity(box);
        this.m_box = box;

        // ⑧ 启动渲染循环（使用 tt.requestAnimationFrame）
        this.m_running = true;
        const loop = (): void => {
            if (!this.m_running) return;
            this.tick();
            tt.requestAnimationFrame(loop);
        };
        tt.requestAnimationFrame(loop);

        console.log("[DemoContextMock] initialize() done.");
    }

    run(): void {
        // 渲染循环由内部 tt.requestAnimationFrame 驱动，外部 main.ts 调用忽略
    }

    private tick(): void {
        if (!this.m_rscene) return;

        // 让立方体每帧旋转
        this.m_rotY += 1.0;
        if (this.m_box) {
            this.m_box.setRotationXYZ(this.m_rotY * 0.5, this.m_rotY, 0);
            this.m_box.update();
        }

        this.m_rscene.run();
    }

    destroy(): void {
        this.m_running = false;
        this.m_rscene = null;
        this.m_box = null;
    }
}

export default DemoContextMock;
