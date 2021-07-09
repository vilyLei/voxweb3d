
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import FBOInstance from "../vox/scene/FBOInstance";
import RendererScene from "../vox/scene/RendererScene";
import DefaultMRTMaterial from "../vox/material/mcase/DefaultMRTMaterial";


export class DemoFBOInstance
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_fboIns:FBOInstance = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize():void
    {
        if(this.m_rscene == null)
        {
            console.log("DemoFBOInstance::initialize()......");
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam:RendererParam = new RendererParam();
            rparam.setCamPosition(500.0,500.0,500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let useMRT:boolean = true;
            if(useMRT)
            {
                // for mrt example
                this.buildMRT();
            }
            else
            {
                // for rtt example
                this.buildRTT();
            }
        }
    }
    
    private buildRTT():void
    {
        let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
        
        // add common 3d display entity ---------------------------------- begin
        var plane:Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
        this.m_rscene.addEntity(plane);

        let axis:Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        let box:Box3DEntity = new Box3DEntity();
        box.initializeCube(150.0,[tex1]);
        this.m_rscene.addEntity(box);
        // add common 3d display entity ---------------------------------- end

        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.setClearRGBAColor4f(0.3,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList([0]);

        let rttBox:Box3DEntity = new Box3DEntity();
        rttBox.initializeCube(200.0, [this.m_fboIns.getRTTAt(0)]);
        this.m_rscene.addEntity(rttBox, 1);                   // add rttBox to The second renderer process
    }
    
    private buildMRT():void
    {
        let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
        
        // add common 3d display entity ---------------------------------- begin
        var plane:Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(new DefaultMRTMaterial());
        plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
        this.m_rscene.addEntity(plane);

        let box:Box3DEntity = new Box3DEntity();
        box.setMaterial(new DefaultMRTMaterial());
        box.initializeCube(150.0,[tex1]);
        this.m_rscene.addEntity(box);
        // add common 3d display entity ---------------------------------- end

        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.setClearRGBAColor4f(0.3,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRenderToRTTTextureAt(1, 1);          // framebuffer color attachment 1
        this.m_fboIns.setRProcessIDList([0]);

        let mrtBox:Box3DEntity = new Box3DEntity();
        mrtBox.initializeCube(200.0, [this.m_fboIns.getRTTAt(0)]);
        mrtBox.setXYZ(-150,0,-150);                           // set position in world space
        this.m_rscene.addEntity(mrtBox, 1);                   // add rttBox to The second renderer process
        
        mrtBox = new Box3DEntity();
        mrtBox.initializeCube(200.0,[this.m_fboIns.getRTTAt(1)]);
        mrtBox.setXYZ(150,0,150);                             // set position in world space
        this.m_rscene.addEntity(mrtBox, 1);                   // add rttBox to The second renderer process
    }
    run():void
    {
        this.m_statusDisp.update();

        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_rscene.runBegin();
        this.m_rscene.update();
        
        // --------------------------------------------- fbo run begin
        this.m_fboIns.run();
        // --------------------------------------------- fbo run end
        
        this.m_rscene.setRenderToBackBuffer();
        this.m_rscene.runAt(1);
        
        this.m_rscene.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoFBOInstance;