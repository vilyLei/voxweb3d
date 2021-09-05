
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

export class DemoDelEntity
{
    constructor(){}

    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

    private m_targets:DisplayEntity[] = [];
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize():void
    {
        console.log("DemoDelEntity::initialize()......");
        if(this.m_rscene == null)
        {
            //DivLog.SetDebugEnabled(true);
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
            let rparam:RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0,800.0,800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            axis.setXYZ(0.0, 0.0, 0.0);
            this.m_rscene.addEntity(axis);
            this.m_targets.push(axis);

            //  axis = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  axis.setXYZ(200.0, 0.0, 0.0);
            //  this.m_rscene.addEntity(axis);
            //  this.m_targets.push(axis);
            

        }
    };

    private mouseDown(evt:any):void
    {
        let destroyEnabled:boolean = false;
        if(this.m_targets != null && this.m_targets.length > 0)
        {
            if(this.m_targets[0] != null)
            {
                console.log("this.m_targets[0].isFree(): ", this.m_targets[0].isFree());
                if(!destroyEnabled)
                {
                    if(this.m_targets[0].isFree())
                    {
                        this.m_rscene.addEntity(this.m_targets[0]);
                    }
                    else
                    {
                        this.m_rscene.removeEntity(this.m_targets[0]);
                    }
                }
                else
                {
                    this.m_rscene.removeEntity(this.m_targets[0]);
                    this.m_targets[0].destroy();
                    this.m_targets[0] = null;
                }
            }
            //  else
            //  {
            //      let axis:Axis3DEntity = new Axis3DEntity();
            //      axis.initialize(700.0);
            //      this.m_rscene.addEntity(axis);
            //      this.m_targets[0] = (axis);
            //  }
        }
    }
    run():void
    {
        this.m_statusDisp.update();
        
        this.m_rscene.run();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoDelEntity;