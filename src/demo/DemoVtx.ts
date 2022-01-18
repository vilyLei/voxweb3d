
import DivLog from "../vox/utils/DivLog";
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import AABB from "../vox/geom/AABB";
import Matrix4 from "../vox/math/Matrix4";
import Matrix4Pool from "../vox/math/Matrix4Pool";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import Color4 from "../vox/material/Color4";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import VtxBufConst from "../vox/mesh/VtxBufConst";

import Box3DMesh from "../vox/mesh/Box3DMesh";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import BaseTestMaterial from "../demo/material/BaseTestMaterial";
import MeshResource from "../vox/mesh/MeshResource";

export class DemoVtx
{
    constructor()
    {
    }

    private m_rscene:RendererScene = null;
    private m_rcontext:RendererInstanceContext = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

    private m_targets:DisplayEntity[] = [];
    private m_srcBoxFrame:BoxFrame3D = null;
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize():void
    {
        console.log("DemoVtx::initialize()......");
        if(this.m_rcontext == null)
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
            this.m_rcontext = this.m_rscene.getRendererContext();
            
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_statusDisp.initialize();

            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

            let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex4 = this.getImageTexByUrl("static/assets/yanj.jpg");
            let tex5 = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));
            
            let boxFrame:BoxFrame3D;

            boxFrame = new BoxFrame3D();
            boxFrame.initialize(new Vector3D(-100,-100,-100),new Vector3D(100,100,100));
            this.m_srcBoxFrame = boxFrame;

            
            boxFrame = new BoxFrame3D();
            if(this.m_srcBoxFrame != null)boxFrame.setMesh(this.m_srcBoxFrame.getMesh());
            boxFrame.initialize(new Vector3D(-100,-100,-100),new Vector3D(100,100,100));
            this.m_rscene.addEntity(boxFrame);
            this.m_targets.push(boxFrame);
            //return;

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            axis.setXYZ(200.0, 0.0, 0.0);
            this.m_rscene.addEntity(axis);
            this.m_targets.push(axis);
        }
    }
    private m_minV:Vector3D = new Vector3D(-100,-100,-100);
    private m_maxV:Vector3D = new Vector3D(100,100,100);
    private m_dvPos:Vector3D = new Vector3D(15,15,15);
    private m_dvNeg:Vector3D = new Vector3D(-15,-15,-15);
    private m_ab:AABB = new AABB();
    private m_flag:boolean = true;

    private updateMeshData():void
    {
        if(this.m_flag)
        {
            this.m_targets[0].setMesh(this.m_targets[1].getMesh());
            this.m_targets[0].updateMeshToGpu(this.m_rscene.getRenderProxy(),true);
        }
        else
        {
            this.m_targets[0].setMesh(this.m_srcBoxFrame.getMesh());
            this.m_targets[0].updateMeshToGpu(this.m_rscene.getRenderProxy(),true);
        }
        this.m_targets[0].updateBounds();
        console.log("this.m_targets[0].getGlobalBounds(): ",this.m_targets[0].getGlobalBounds());
        this.m_flag = !this.m_flag;
    }
    private updateVtxData():void
    {
        let boxFrame:BoxFrame3D = this.m_targets[0] as BoxFrame3D;
        let index:number = 7;
        if(this.m_flag)
        {
            this.m_flag = false;
            boxFrame.getVertexAt(index, this.m_minV);
        }
        console.log("this.m_minV, ",this.m_minV);
        boxFrame.setVertexAt(index,this.m_minV);
        boxFrame.updateMeshToGpu(this.m_rscene.getRenderProxy(),true);
        this.m_minV.x += 5.0;
        //this.m_maxV.x += 5.0;
    }
    private mouseDown(evt:any):void
    {
        console.log("mouse down...,this.m_targetDisp != null: "+(this.m_targets != null));
        if(this.m_targets != null && this.m_targets.length > 0)
        {
            this.updateMeshData();
            return;
            this.updateVtxData();
            return;
            // test visible
            //  this.m_targets[0].setVisible(!this.m_targets[0].getVisible());
            //  return;
            if(this.m_targets[0] != null)
            {
                this.m_rscene.removeEntity(this.m_targets[0]);
                this.m_targets[0].destroy();
                this.m_targets[0] = null;
            }
            else
            {
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(700.0);
                this.m_rscene.addEntity(axis);
                this.m_targets[0] = (axis);
            }
        }
    }
    run():void
    {
        let pcontext:RendererInstanceContext = this.m_rcontext;
        
        // show fps status
        this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
        this.m_statusDisp.update();
        
        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        // render begin
        this.m_rscene.runBegin();

        // run logic program
        this.m_rscene.update();
        this.m_rscene.run();

        // render end
        this.m_rscene.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

        MeshResource.ClearTest();
    }
}
export default DemoVtx;