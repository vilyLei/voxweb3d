
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import ScreenFixedPlaneMaterial from "../vox/material/mcase/ScreenFixedPlaneMaterial";
import * as PSDepthMaterialT from "../demo/material/PSDepthMaterial";


import { TextureBlock } from "../vox/texture/TextureBlock";
//import ScreenFixedPlaneMaterial = ScreenFixedPlaneMaterialT.vox.material.mcase.ScreenFixedPlaneMaterial;
import PSDepthMaterial = PSDepthMaterialT.demo.material.PSDepthMaterial;

export namespace demo {
    export class DemoPreDepth {
        constructor() {
        }
        private m_texBlock: TextureBlock;
        private m_renderer: RendererInstance = null;
        private m_rcontext: RendererInstanceContext = null;
        private m_texLoader: ImageTextureLoader;
        private m_camTrack: CameraTrack = null;
        private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
        private m_depMaterial: PSDepthMaterial = new PSDepthMaterial();
        initialize(): void {
            console.log("DemoPreDepth::initialize()......");
            if (this.m_rcontext == null) {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

                RendererState.CreateRenderState("depthSt",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.TRUE_GEQUAL);
                //RendererState.CreateRenderState("depthSt", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.TRUE_EQUAL);

                let rparam: RendererParam = new RendererParam();
                rparam.setCamProject(45.0, 30.0, 5000.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext() as any;

                this.m_statusDisp.initialize();

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer(this.m_renderer.getRenderProxy());
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
                let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");


                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                // add common 3d display entity
                var plane: Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                this.m_renderer.addEntity(plane);

                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.name = "axis";
                //  axis.initialize(300.0);
                //  this.m_renderer.addEntity(axis);

                let scale: number = 0.5;
                let box: Box3DEntity;
                let box_minV: Vector3D = new Vector3D(-100.0, -100.0, -100.0);
                let box_maxV: Vector3D = new Vector3D(100.0, 100.0, 100.0);
                for (let i: number = 0; i < 100; ++i) {
                    box = new Box3DEntity();
                    box.initialize(box_minV, box_maxV, [tex1]);
                    box.setScaleXYZ(scale, scale, scale);
                    box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
                // add rtt texture display entity
                let scrM: ScreenFixedPlaneMaterial = new ScreenFixedPlaneMaterial();
                let scrPlane: Plane3DEntity = new Plane3DEntity();
                scrPlane.setMaterial(scrM);
                scrPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0, [this.m_texBlock.getRTTTextureAt(1)]);
                this.m_renderer.addEntity(scrPlane, 1);
            }
        }
        run(): void {
            this.m_statusDisp.update();
            this.m_texBlock.run();

            let rinstance: RendererInstance = this.m_renderer;
            let pcontext: RendererInstanceContext = this.m_rcontext;

            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.renderBegin();
            rinstance.update();

            // --------------------------------------------- rtt begin
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.synFBOSizeWithViewport();
            pcontext.useGlobalMaterial(this.m_depMaterial);
            pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            pcontext.useFBO(true, true, false);
            rinstance.runAt(0);

            pcontext.unlockMaterial();
            pcontext.useGlobalRenderStateByName("depthSt");
            pcontext.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 0);
            pcontext.useFBO(true, false, false);
            rinstance.runAt(0);
            // --------------------------------------------- rtt end
            pcontext.unlockRenderState();
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            pcontext.setRenderToBackBuffer();
            rinstance.runAt(1);

            pcontext.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
        }
    }
}
