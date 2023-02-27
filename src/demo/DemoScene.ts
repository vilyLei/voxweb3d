
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import Color4 from "../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import IMouseEvent from "../vox/event/IMouseEvent";

export class DemoScene {
    constructor() { }

    private m_init = true;
    private m_texLoader: ImageTextureLoader = null;
    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    initialize(): void {
        console.log("DemoScene::initialize()......");

        if (this.m_init) {
            this.m_init = false;

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            let rparam = new RendererParam();
            rparam.setCamProject(45.0, 10.1, 9000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            let rscene = new RendererScene();
            rscene.initialize(rparam).setAutoRunning(true);

            new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
            new RenderStatusDisplay(rscene, true);

            this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);
            rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: IMouseEvent): void => {
                let color = new Color4(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
                rscene.setClearColor(color);
            });
            // RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            // RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let tex0 = this.getTexByUrl("static/assets/default.jpg");
            let tex1 = this.getTexByUrl("static/assets/broken_iron.jpg");

            let axis = new Axis3DEntity();
            axis.initialize(600.0);
            rscene.addEntity(axis);

            let i = 0;
            let total = 0;
            let scaleK = 1.0;
            let plane: Plane3DEntity = null;
            for (i = 0; i < 5; ++i) {
                plane = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 2000.0 - 1000.0);
                rscene.addEntity(plane);
            }

            let srcBox = new Box3DEntity();
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
                rscene.addEntity(box);

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
                rscene.addEntity(sph);
            }
        }
    }
}
export default DemoScene;