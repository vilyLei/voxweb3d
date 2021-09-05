
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import {TextureConst} from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import { ObjLoader } from "../vox/assets/ObjLoader";

export class DemoObj3DModule
{
    constructor(){}

    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_rscene:RendererScene = null;
    private m_rcontext:RendererInstanceContext = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_profileInstance:ProfileInstance = null;
    private m_targets:DisplayEntity[] = [];

    private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize():void
    {
        console.log("DemoObj3DModule::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
            let rparam:RendererParam = new RendererParam();
            rparam.setCamPosition(800.0,800.0,800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
            
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance = new ProfileInstance();
            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

            //              let axis:Axis3DEntity = new Axis3DEntity();
            //              axis.initialize(300.0);
            //              this.m_rscene.addEntity(axis);
            /*
            // add common 3d display entity
            let plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            this.m_rscene.addEntity(plane);
            this.m_targets.push(plane);
            //this.m_disp = plane;
            //*/
            //this.m_rscene.setAutoRunningEnabled(false);
            this.update();

            //return;
            let objUrl:string = "static/assets/obj/box01.obj";
            objUrl = "static/assets/obj/building_001.obj";
            let objDisp:ObjData3DEntity = new ObjData3DEntity();
            //objDisp.mouseEnabled = true;
            objDisp.moduleScale = 3.0;
            objDisp.initializeByObjDataUrl(objUrl,[this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //objDisp.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
            this.m_rscene.addEntity(objDisp);
            
            let url:string = "static/assets/obj/objTest01.zip";
            let objLoader:ObjLoader = new ObjLoader();
            objLoader.load(url);

        }
    }
    private mouseDown(evt:any):void
    {
        if(this.m_targets != null && this.m_targets.length > 0)
        {
            
        }
    }
    private m_timeoutId:any = -1;

    private update():void
    {
        if(this.m_timeoutId > -1)
        {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
        let pcontext:RendererInstanceContext = this.m_rcontext;
        
        this.m_rscene.update();
        this.m_statusDisp.render();
    }
    run():void
    {
        this.m_statusDisp.update(false);

        this.m_rscene.runBegin();
        this.m_rscene.run();
        this.m_rscene.runEnd();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        if(this.m_profileInstance != null)this.m_profileInstance.run();
        this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
    }
}
export default DemoObj3DModule;