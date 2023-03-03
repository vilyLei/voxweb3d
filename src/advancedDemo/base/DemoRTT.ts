
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import Color4 from "../../vox/material/Color4";

import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";

import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
export class DemoRTT {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_rct: IRendererInstanceContext = null;
    getImageTexByUrl(purl: string): TextureProxy {
        let tex = this.m_texLoader.getImageTexByUrl("static/assets/" + purl);
        tex.mipmapEnabled = true;
        return tex;
    }
    initialize(): void {
        console.log("DemoRTT::initialize()......");
        if (this.m_rscene == null) {
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            
            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_rscene.updateCamera();
            this.m_rct = this.m_rscene.getRendererContext();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, true);

            let tex0 = this.getImageTexByUrl("default.jpg");
            let tex1 = this.getImageTexByUrl("broken_iron.jpg");

            let axis = new Axis3DEntity();
            axis.initialize(200.0);
            this.m_rscene.addEntity(axis);

            ///*
            let i: number = 0;
            let total: number = 0;
            let scaleK: number = 1.0;
            let plane: Plane3DEntity = null;
            for (i = 0; i < 5; ++i) {
                plane = new Plane3DEntity();
                plane.uuid = "plane_" + i;
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(plane);
            }

            let srcBox = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            total = 5;
            let box: Box3DEntity = null;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                box.uuid = "box_" + i;
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
                sph.uuid = "sphere_" + i;
                sph.initialize(100, 20, 20, [tex1]);
                if (total > 1) {
                    sph.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
                }
                else {
                    sph.setXYZ(150.0, 0.0, 0.0);
                }
                this.m_rscene.addEntity(sph);
            }
            //*/
            let rttTexBox = new Box3DEntity();
            rttTexBox.initialize(new Vector3D(-500.0, -500.0, -500.0), new Vector3D(500.0, 500.0, 500.0), [this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            this.m_rscene.addEntity(rttTexBox, 1);

        }
    }
    private m_bgColor = new Color4(0.0, 0.3, 0.1);
    mouseDownListener(evt: any): void {
        this.m_bgColor.setRGB3f(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
    }

    run(): void {
        
        this.m_rscene.runBegin();        
        this.m_rscene.update();

        // --------------------------------------------- rtt begin
        this.m_rscene.setClearRGBColor3f(0.1, 0.0, 0.1);
        this.m_rct.synFBOSizeWithViewport();
        this.m_rct.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), true, false, 0);
        this.m_rct.useFBO(true, true, false);
        this.m_rscene.runAt(0);
        // --------------------------------------------- rtt end
        this.m_rscene.setClearRGBColor3f(this.m_bgColor.r, this.m_bgColor.g, this.m_bgColor.b);
        this.m_rscene.setRenderToBackBuffer();
        this.m_rscene.runAt(1);
        this.m_rscene.runEnd();
        
    }
}
export default DemoRTT;