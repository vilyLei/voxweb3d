/**
 * DemoContextMock
 *
 * 验证目标：
 *   在 Web 浏览器中模拟抖音小游戏 tt API，
 *   通过 TTMock 注入 canvas，绕过引擎的 DOM/div 初始化路径，
 *   验证引擎核心渲染管线（含 Lambert 光照）在非 DOM 环境下能正常工作。
 *
 * 对应改造点：
 *   ① TTMock.install()             — 模拟 tt 全局对象（已实现）
 *   ② RendererParam.injectCanvas() — 无 div，canvas 注入参数（已实现）
 *   ③ RAdapterContext else 分支    — canvas 注入路径（已实现）
 *   ④ DebugMaterialContext         — Lambert 光照 + 无纹理纯色材质
 */

import TTMock from "../app/platform/TTMock";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Vector3D from "../vox/math/Vector3D";
import IRendererScene from "../vox/scene/IRendererScene";
import Color4 from "../vox/material/Color4";
import { SpecularMode, LambertLightMaterial } from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import MouseEvent from "../vox/event/MouseEvent";

export class DemoContextMock {

    private m_rscene: IRendererScene = null;
    private m_sph: Sphere3DEntity = null;
    private m_box: Box3DEntity = null;
    private m_rotY = 0.0;
    private m_running = false;
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    constructor() {}

    initialize(): void {
        console.log("DemoContextMock::initialize() for tt .....");

        // 绕过域名白名单验证（本地开发/小游戏平台均需要）
        // 用 globalThis 而非 window，兼容小游戏沙箱（无 window 对象）
        (globalThis as any).VoxVerify = { isEnabled: () => true };

        // ① 安装 tt mock（浏览器中生效，真机上自动跳过）
        TTMock.install();

        const tt = (globalThis as any).tt;

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
        rscene.enableMouseEvent(false);   // 启用引擎事件管线（false = 用 CPU ray picking，无需 GPU）
        this.m_rscene = rscene;

        // ⑦ 注册触摸事件
        // 抖音小游戏模拟器需要在 onShow 之后才能收到 touch 事件
        // 浏览器 mock 下 onShow 不存在，直接注册
        const stage = rscene.getStage3D() as any;
        const dpr = sysInfo.pixelRatio;
        const stageH = sysInfo.screenHeight;

        const registerTouch = () => {
            tt.onTouchStart((res: any) => {
                const t = res.touches[0];
                if (!t) return;
                const px = 0 | (dpr * t.clientX);
                const py = 0 | (dpr * t.clientY);
                stage.mouseX = px;
                stage.mouseY = stageH - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseDown(1);
            });

            tt.onTouchMove((res: any) => {
                const t = res.touches[0];
                if (!t) return;
                const px = 0 | (dpr * t.clientX);
                const py = 0 | (dpr * t.clientY);
                stage.mouseX = px;
                stage.mouseY = stageH - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseMove();
            });

            tt.onTouchEnd((res: any) => {
                stage.mouseUp(1);
                stage.mouseClick();
            });
        };

        if (typeof tt.onShow === 'function') {
            tt.onShow(() => { registerTouch(); });
        }
        // 立即注册（模拟器/真机 onShow 可能已过）
        registerTouch();
        // ⑦ 初始化 Lambert 光照材质上下文
        const mcParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 2;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 0;
        mcParam.vsmEnabled = false;
        this.m_materialCtx.initialize(rscene, mcParam);

        // 点光源
        let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        if (pointLight != null) {
            pointLight.position.setXYZ(-200.0, 56.0, 0.0);
            pointLight.color.setRGB3f(0.0, 1.0, 0.0);
        }
        pointLight = this.m_materialCtx.lightModule.getPointLightAt(1);
        if (pointLight != null) {
            pointLight.position.setXYZ(-200.0, 56.0, -200.0);
            pointLight.color.setRGB3f(0.0, 0.0, 1.0);
        }

        // 方向光
        const direcLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
        if (direcLight != null) {
            direcLight.direction.setXYZ(0.0, -1.0, 1.0);
            direcLight.color.setRGB3f(0.7, 0.7, 0.7);
        }

        this.m_materialCtx.lightModule.update();

        // ⑧ 创建 Lambert 材质（无纹理，纯色 + 光照）—— 对齐 DemoLambertLightWithoutTex
        const material = new LambertLightMaterial();
        material.setMaterialPipeline(this.m_materialCtx.pipeline);
        material.shadowReceiveEnabled = false;
        material.fogEnabled = false;
        material.lightEnabled = true;
        material.specularMode = SpecularMode.FragColor;
        material.initializeLocalData();
        material.setSpecularIntensity(64.0);
        material.setLightBlendFactor(0.7, 0.3);
        material.setBlendFactor(0.2, 0.8);
        material.setSpecularColor(new Color4(2.0, 2.0, 2.0));
        material.setColor(new Color4(1.0, 1.0, 1.0, 1.0), new Color4(0.4, 0.4, 0.4));

        // ⑨ 添加测试物体：坐标轴 + 球体 + 立方体
        const axis = new Axis3DEntity();
        axis.initialize(400.0);
        rscene.addEntity(axis);

        const sphMaterial = new LambertLightMaterial();
        sphMaterial.copyFrom(material);
        const sph = new Sphere3DEntity();
        sph.setMaterial(sphMaterial);
        sph.initialize(100, 20, 20);
        sph.setXYZ(0, -110, 0);
        rscene.addEntity(sph);
        this.m_sph = sph;

        const boxMaterial = new LambertLightMaterial();
        boxMaterial.copyFrom(material);
        boxMaterial.setColor(new Color4(1.0, 0.7, 0.5));
        const box = new Box3DEntity();
        box.setMaterial(boxMaterial);
        box.initializeCube(150);
        box.setXYZ(190, -110, -90);
        rscene.addEntity(box);

        // 场景级别事件监听：点击改变球体颜色
        rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any) => {
            sphMaterial.setColor(new Color4(Math.random(), Math.random(), Math.random(), 1.0));
        });
        this.m_box = box;

        // ⑩ 启动渲染循环
        // 抖音小游戏：requestAnimationFrame 是全局函数，不在 tt 上
        // 浏览器 mock：window.requestAnimationFrame 也在 globalThis 上
        const raf: (cb: FrameRequestCallback) => void =
            typeof (globalThis as any).requestAnimationFrame === 'function'
                ? (cb) => (globalThis as any).requestAnimationFrame(cb)
                : (cb) => tt.requestAnimationFrame(cb);

        this.m_running = true;
        const loop = (): void => {
            if (!this.m_running) return;
            this.tick();
            raf(loop);
        };
        raf(loop);

        console.log("[DemoContextMock] initialize() done.");
    }

    run(): void {
        // 渲染循环由内部 requestAnimationFrame 驱动，外部 main.ts 调用忽略
    }

    private tick(): void {
        if (!this.m_rscene) return;

        this.m_rotY += 1.0;
        if (this.m_sph) {
            this.m_sph.setRotationXYZ(this.m_rotY * 0.5, this.m_rotY, 0);
            this.m_sph.update();
        }
        if (this.m_box) {
            this.m_box.setRotationXYZ(0, -this.m_rotY * 0.8, this.m_rotY * 0.3);
            this.m_box.update();
        }

        this.m_rscene.run();
    }

    destroy(): void {
        this.m_running = false;
        this.m_rscene = null;
        this.m_sph = null;
        this.m_box = null;
    }
}

export default DemoContextMock;

// 自动启动 — 直接内联到小游戏 game_contextMock.js 时无需额外调用
if (typeof (globalThis as any).tt !== "undefined") {
    const _app = new DemoContextMock();
    _app.initialize();
}
