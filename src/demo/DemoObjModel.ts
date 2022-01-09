
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst } from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import { UserInteraction } from "../vox/engine/UserInteraction";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Vector3D from "../vox/math/Vector3D";

export class DemoObjModel {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_interation: UserInteraction = new UserInteraction();
    initialize(): void {
        console.log("DemoObjModel::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_interation.initialize( this.m_rscene );

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/box_wood01.jpg");

            this.m_statusDisp.initialize();
            this.m_interation.cameraZoomController.syncLookAt = true;

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300);
            this.m_rscene.addEntity(axis);

            //let objUrl: string = "static/assets/obj/box01.obj";
            //let objUrl: string = "static/assets/obj/monkey.obj";
            //let objUrl: string = "static/assets/obj/room_01.obj";
            let objUrl: string = "static/assets/obj/ellipsoid_01.obj";
            tex1.flipY = true;
            //objUrl = "static/assets/obj/building_001.obj";
            let objDisp: ObjData3DEntity = new ObjData3DEntity();
            objDisp.showDoubleFace();
            //objDisp.dataIsZxy = true;
            let moduleScale = 100.0;//10.0 + Math.random() * 5.5;
            //objDisp.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            objDisp.initializeByObjDataUrl(objUrl, [tex1]);
            objDisp.setScaleXYZ(moduleScale, moduleScale, moduleScale);
            //objDisp.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            this.m_rscene.addEntity(objDisp);
        }
    }
    run(): void {
        this.m_statusDisp.update();
        this.m_interation.run();
        this.m_rscene.run();
    }
}
export default DemoObjModel;