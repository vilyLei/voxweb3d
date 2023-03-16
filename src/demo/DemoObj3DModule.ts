
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import { ObjLoader } from "../vox/assets/ObjLoader";
import DataMesh from "../vox/mesh/DataMesh";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

export class DemoObj3DModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_targets: DisplayEntity[] = [];

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoObj3DModule::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //this.m_profileInstance = new ProfileInstance();
            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            // this.m_statusDisp.initialize();

            //              let axis:Axis3DEntity = new Axis3DEntity();
            //              axis.initialize(300.0);
            //              this.m_rscene.addEntity(axis);
            ///*
            // add common 3d display entity
            // let plane: Plane3DEntity = new Plane3DEntity();
            // plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //this.m_rscene.addEntity(plane);
            //this.m_targets.push(plane);
            //this.m_disp = plane;
            //*/

            //return;
            let objUrl: string = "static/assets/obj/box01.obj";
            objUrl = "static/assets/obj/sc01.obj";
            // objUrl = "static/assets/obj/building_001.obj";
            // objUrl = "static/assets/obj/torus01.obj";
            // objUrl = "static/assets/obj/torus01.obj";
            // objUrl = "static/private/fbx/plane01.obj";

            let objDisp = new ObjData3DEntity();
            objDisp.normalEnabled = true;
            objDisp.moduleScale = 1.0;
            objDisp.initializeByObjDataUrl(objUrl, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //objDisp.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
            this.m_rscene.addEntity(objDisp);
            let scale = 10.0;
            objDisp.setScaleXYZ(scale, scale, scale);
			objDisp.update();
            //  let url:string = "static/assets/obj/objTest01.zip";
            //  let objLoader:ObjLoader = new ObjLoader();
            //  objLoader.load(url);

        }
    }
    private mouseDown(evt: any): void {
        if (this.m_targets != null && this.m_targets.length > 0) {

        }
    }
    run(): void {
        this.m_rscene.run();
    }
}
export default DemoObj3DModule;
