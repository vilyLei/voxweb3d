
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import RendererState from "../vox/render/RendererState";
import { GLBlendMode, CullFaceMode, DepthTestMode } from "../../src/vox/render/RenderConst";

export class DemoBlendMode {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_CameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoBlendMode::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0,800.0,800.0);
            rparam.setAttriAntialias( true );
            //rparam.setAttriStencil(true);
            rparam.setAttriAlpha(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            this.m_rscene.enableMouseEvent(true);
            this.m_CameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_CameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.test01();

            this.update();

        }
    }
    
    private test01(): void {

        //  let axis: Axis3DEntity = new Axis3DEntity();
        //  axis.initialize(500.0);
        //  this.m_rscene.addEntity(axis,0);
        //return;
        // add common 3d display entity
        let plane:Plane3DEntity;
        plane = new Plane3DEntity();
        plane.showDoubleFace();
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/displacement_01.jpg")]);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/eve_01.jpg")]);
        this.m_rscene.addEntity(plane,0);
        //plane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        
        let blendModeSpec0: number = RendererState.CreateBlendModeSeparate("blendModeSpec0"
        , GLBlendMode.SRC_ALPHA
        , GLBlendMode.ONE
        , GLBlendMode.ZERO
        , GLBlendMode.ONE_MINUS_SRC_ALPHA
        )
        let renderSt0: number = RendererState.CreateRenderState("renderSt0"
        , CullFaceMode.NONE
        , blendModeSpec0
        , DepthTestMode.TRANSPARENT_SORT
        )
        plane = new Plane3DEntity();
        //plane.premultiplyAlpha = true;
        //let tex: TextureProxy = this.getImageTexByUrl("static/assets/green_rect3.png",true,true);
        //let tex: TextureProxy = this.getImageTexByUrl("static/assets/stones_02.png",true,true);
        let tex: TextureProxy = this.getImageTexByUrl("static/assets/cloud01.png",true,true);
        //tex.premultiplyAlpha = true;
        plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [tex]);
        plane.setXYZ(0.0,1.0,0.0);
        (plane.getMaterial() as any).setAlpha(0.7);
        this.m_rscene.addEntity(plane,1);
        //plane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
        plane.setRenderState(renderSt0);
    }
    private test02(): void {

        //  let axis: Axis3DEntity = new Axis3DEntity();
        //  axis.initialize(500.0);
        //  this.m_rscene.addEntity(axis,0);
        //return;
        // add common 3d display entity
        let plane:Plane3DEntity = new Plane3DEntity();
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/displacement_01.jpg")]);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/eve_01.jpg")]);
        this.m_rscene.addEntity(plane,0);
        //plane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        plane = new Plane3DEntity();
        plane.premultiplyAlpha = true;
        //let tex: TextureProxy = this.getImageTexByUrl("static/assets/green_rect3.png",true,true);
        //let tex: TextureProxy = this.getImageTexByUrl("static/assets/stones_02.png",true,true);
        let tex: TextureProxy = this.getImageTexByUrl("static/assets/cloud01.png",true,true);
        tex.premultiplyAlpha = true;
        plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [tex]);
        plane.setXYZ(0.0,1.0,0.0);
        (plane.getMaterial() as any).setAlpha(0.7);
        this.m_rscene.addEntity(plane,1);
        plane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
    }
    private test03(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(500.0);
        this.m_rscene.addEntity(axis,0);
        //return;
        // add common 3d display entity
        let plane:Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
        this.m_rscene.addEntity(plane,0);
        plane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        let sph: Sphere3DEntity = new Sphere3DEntity();
        //sph.initialize(200.0,20,20,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
        sph.initialize(200.0, 20, 20, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_rscene.addEntity(sph,2);
        sph.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }
    
    run(): void {

        this.m_statusDisp.update(false);
        
        this.m_stageDragSwinger.runWithYAxis();
        this.m_CameraZoomController.run(null, 30.0);

        this.m_rscene.run(true);
        this.m_profileInstance.run();
    }
}
export default DemoBlendMode;