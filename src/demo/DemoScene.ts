
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import Color4 from "../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";
import H5FontSystem from "../vox/text/H5FontSys";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import { UserInteraction } from "../vox/engine/UserInteraction";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

export class DemoScene {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_interaction: UserInteraction = new UserInteraction();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    initialize(): void {
        console.log("DemoScene::initialize()......");
        if (this.m_rscene == null) {
            H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, false, false);
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 10.1, 9000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_interaction.initialize( this.m_rscene );
            

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");            
            let tex2 = this.getImageTexByUrl("static/assets/displacement_01.jpg");
            let tex3 = this.getImageTexByUrl("static/assets/flare_core_02.jpg");

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);
            
            let i: number = 0;
            let total: number = 0;
            let scaleK: number = 1.0;
            let plane: Plane3DEntity = null;
            for (i = 0; i < 5; ++i) {
                plane = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(plane);
            }

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            total = 5;
            let box: Box3DEntity = null;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                if (total > 1) {
                    box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                    box.setRotationXYZ(Math.random() * 500.0, Math.random() * 500.0, Math.random() * 500.0);
                    box.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
                }
                else {
                    box.setXYZ(-150.0, 0.0, 0.0);
                }
                this.m_rscene.addEntity(box);

            }
            let sph: Sphere3DEntity = null;
            total = 5;
            for (i = 0; i < total; ++i) {
                sph = new Sphere3DEntity();
                sph.initialize(100, 20, 20, [tex1]);
                if (total > 1) {
                    sph.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
                }
                else {
                    sph.setXYZ(150.0, 0.0, 0.0);
                }
                this.m_rscene.addEntity(sph);
            }
        }
    }
    private m_bgColor: Color4 = new Color4(0.0, 0.3, 0.1);
    mouseDownListener(evt: any): void {
        this.m_bgColor.setRGB3f(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
    }
    run(): void {
        
        this.m_rscene.setClearColor(this.m_bgColor);

        this.m_interaction.run();

        this.m_rscene.run();

        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
}
export default DemoScene;