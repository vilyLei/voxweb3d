
import RendererDevice from "../vox/render/RendererDevice";
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
import Box3DEntity from "../vox/entity/Box3DEntity";
import { CullFaceMode, DepthTestMode, RenderBlendMode } from "../vox/render/RenderConst";

export class DemoPreDepthTransparent {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoPreDepthTransparent::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0,800.0,800.0);
            rparam.setAttriAntialias( true );
            rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            
            RendererState.CreateRenderState("depthSt",CullFaceMode.NONE,RenderBlendMode.TRANSPARENT,DepthTestMode.FALSE_LEQUAL);
            //RendererState.CreateRenderState("depthSt",CullFaceMode.NONE,RenderBlendMode.TRANSPARENT,DepthTestMode.TRUE_EQUAL);
            //RendererState.CreateRenderState("depthSt", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.TRUE_EQUAL);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(500.0);
            //  this.m_rscene.addEntity(axis,1);

            // add common 3d display entity
            //  let plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //  (plane.getMaterial() as any).setRGBA4f(1.0,0.0,0.0, 0.5);
            //  this.m_rscene.addEntity(plane);

            //  let box:Box3DEntity = new Box3DEntity();
            //  box.initializeSizeXYZ(800.0,8.0,800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //  (box.getMaterial() as any).setRGBA4f(1.0,0.0,0.0, 0.5);
            //  this.m_rscene.addEntity(box);

            let sph: Sphere3DEntity = new Sphere3DEntity();
            //sph.initialize(200.0,20,20,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            sph.initialize(200.0, 20, 20, [this.getImageTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(sph);
            (sph.getMaterial() as any).setRGBA4f(0.0,1.0,0.0, 0.5);

            this.update();

        }
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
        this.m_cameraZoomController.run(null, 30.0);

        this.m_rscene.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
        //  this.m_rscene.run(true);
        
        this.m_rscene.update();
        this.m_rscene.runBegin();
        
        //this.m_rcontext.useGlobalRenderState(RendererState.BACK_TRANSPARENT_STATE);
        //  RendererState.SetBlendEnable(false);
        //  this.m_rcontext.useGlobalColorMask(RendererState.COLOR_MASK_ALL_FALSE);
        //  this.m_rscene.runAt(0);
        //  this.m_rcontext.unlockColorMask();
        //  RendererState.SetBlendEnable(true);
        //  this.m_rcontext.useGlobalColorMask(RendererState.COLOR_MASK_ALL_TRUE);
        //  //this.m_rcontext.useGlobalRenderState(RendererState.NONE_TRANSPARENT_STATE);
        
        this.m_rcontext.useGlobalRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
        //this.m_rcontext.useGlobalRenderStateByName("depthSt");
        this.m_rscene.runAt(0);
        //this.m_rcontext.unlockRenderState();
        this.m_rscene.runEnd();

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        //this.m_profileInstance.run();
    }
}
export default DemoPreDepthTransparent;