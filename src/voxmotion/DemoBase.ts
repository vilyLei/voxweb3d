
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import Vector3D from "../vox/math/Vector3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import { MaterialContext } from "../materialLab/base/MaterialContext";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import {EnergyAttenuation} from "./base/EnergyAttenuation";
import DisplayEntity from "../vox/entity/DisplayEntity";


export class DemoBase {

    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_pos: Vector3D = new Vector3D();
    private m_target: DisplayEntity = null;
    private m_materialCtx: MaterialContext = new MaterialContext();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private m_ea:EnergyAttenuation = null;
    initialize(): void {

        console.log("DemoBase::initialize()......");

        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);

            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //console.log("isWinExternalVideoCard: ",isWinExternalVideoCard);
            this.m_materialCtx.initialize( this.m_rscene );
            
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            this.m_target = axis;

            console.log(">>>>>>>>>>>>>>> test ea....");
            let ea = new EnergyAttenuation();
            this.m_ea = ea;
            ea.setEnergy(1.0);
            // for(let i: number = 0; i < 20; ++i) {
            //     ea.run();
            // }
            this.update();
        }
    }
    private mouseDown(evt: any): void {

    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_statusDisp.render();
    }
    run(): void {
        if(this.m_ea.isMoving()) {
            this.m_ea.run();
            console.log("bbb");
            this.m_pos.x += this.m_ea.velocity* 100.0;
            this.m_target.setPosition(this.m_pos);
            this.m_target.update();
        }
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_statusDisp.update(false);

        //this.m_materialCtx.run();
        this.m_rscene.run(true);

    }
}
export default DemoBase;