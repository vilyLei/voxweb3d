
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import * as ClipsBillboard3DEntityT from "../../vox/entity/ClipsBillboard3DEntity";

import ClipsBillboard3DEntity = ClipsBillboard3DEntityT.vox.entity.ClipsBillboard3DEntity;
import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageCubeTextureProxy from "../../vox/texture/ImageCubeTextureProxy";
import RendererScene from "../../vox/scene/RendererScene";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import FrameBufferType from "../../vox/render/FrameBufferType";
class CameraList
{
    private m_cams: CameraBase[] = null;
    private m_initFlag:boolean = true;
    getAt(i: number): CameraBase
    {
        return this.m_cams[i];
    }
    
    create(posV: Vector3D,pw: number,ph: number): void {

        if( this.m_initFlag )
        {
            this.m_cams = [
                new CameraBase(0),new CameraBase(0),new CameraBase(0),
                new CameraBase(0),new CameraBase(0),new CameraBase(0)
            ];

            let fov: number = 90.0;
            let fovAng = MathConst.DegreeToRadian(fov);
            let near: number = 1.0;
            let far: number = 5000.0;

            let kaspect:number = pw / ph;
            let camera:CameraBase = null;
            camera = this.m_cams[0];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x + 300.0,posV.y + 0.0,posV.z + 0.0), new Vector3D(0,-1,0));
            camera.update();
            camera = this.m_cams[1];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x - 300.0,posV.y + 0.0,posV.z + 0.0), new Vector3D(0,-1,0));
            camera.update();
            camera = this.m_cams[2];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x + 0.0,posV.y + 300.0,posV.z + 0.0), new Vector3D(0,0,1));
            camera.update();
            camera = this.m_cams[3];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x + 0.0,posV.y - 300.0,posV.z + 0.0), new Vector3D(0,0,-1));
            camera.update();
            camera = this.m_cams[4];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x + 0.0,posV.y + 0.0,posV.z + 300.0), new Vector3D(0,-1,0));
            camera.update();
            camera = this.m_cams[5];
            camera.perspectiveRH(fovAng, kaspect, near, far);
            camera.lookAtRH(posV, new Vector3D(posV.x + 0.0,posV.y + 0.0,posV.z - 300.0), new Vector3D(0,-1,0));
            camera.update();

            this.m_initFlag = false;
        }
    }
}

export default class CubeRTTScene
{
    private static s_id: number = 0;
    private m_id: number = CubeRTTScene.s_id++;
    private m_tarEntity: DisplayEntity = null;
    private m_initFlag: boolean = true;
    private m_camList: CameraList = null;
    private m_enabled: boolean = true;
    private m_texProxy: RTTTextureProxy = null;
    private m_texW: number = 512.0;
    private m_texH: number = 512.0;
    private m_rscene: RendererScene = null;
    constructor()
    {
        this.m_id = CubeRTTScene.s_id++;
    }
    initialize(sc: RendererScene, pw: number, ph: number): void {
        this.m_texW = pw;
        this.m_texH = ph;
        this.m_rscene = sc;
        if(this.m_camList == null)
        {
            this.m_camList = new CameraList();
            this.m_initFlag = false;
            this.m_camList.create(new Vector3D(0.0,0.0,0.0), this.m_texW, this.m_texH);
            this.getCubeTexture();
            let rctx: RendererInstanceContext = sc.getRendererContext();
            rctx.createFBOAt(0, FrameBufferType.FRAMEBUFFER, 512,512,true,false,0);
        }
    }
    getId(): number
    {
        return this.m_id;
    }
    getCubeTexture(): TextureProxy
    {
        if(this.m_texProxy == null)
        {
            this.m_texProxy = this.m_rscene.textureBlock.createCubeRTTTextureAt(0,this.m_texW, this.m_texH);
            this.m_texProxy.name = "CubeRTT"+ this.m_id;
        }
        return this.m_texProxy;
    }
    setDispEntity(dispEntity: DisplayEntity)
    {
        this.m_tarEntity = dispEntity;
    }
    setDispVisible(boo: boolean): void
    {
        this.m_tarEntity.setVisible(boo);
    }
    getDispVisible(): boolean
    {
        return this.m_tarEntity.getVisible();
    }
    setEnabled(boo: boolean): void
    {
        this.m_enabled = boo;
        this.m_tarEntity.setVisible(boo);
    }
    getEnabled(): boolean
    {
        return this.m_enabled;
    }
    run()
    {
        if(this.m_enabled)
        {
            if(this.m_camList == null)
            {
                this.m_camList = new CameraList();
                this.m_initFlag = false;
                this.m_camList.create(new Vector3D(0.0,0.0,0.0), this.m_texW, this.m_texH);
                this.getCubeTexture();
            }
            this.setDispVisible(false);

            let renderer = this.m_rscene;

            let rctx: RendererInstanceContext = renderer.getRendererContext();
            let camList: CameraList = this.m_camList;

            let attachmentTot: number = 1;

            //console.log("draw cube face 0.");


            renderer.setClearRGBColor3f(0.1,0.2,0.1);
            rctx.resetFBOAttachmentMask(false);

            renderer.updateCameraDataFromCamera( camList.getAt(0) );   
            rctx.setFBOAttachmentMaskAt(0,true);            

            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true, false);
            renderer.runAt(0);

            //console.log("draw cube face 1.");
            renderer.updateCameraDataFromCamera( camList.getAt(1) );
            rctx.setFBOAttachmentMaskAt(0,false);
            rctx.setFBOAttachmentMaskAt(1,true);
            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true, false);
            renderer.runAt(0);

            //console.log("draw cube face end.");
        
            renderer.updateCameraDataFromCamera( camList.getAt(2) );
            rctx.setFBOAttachmentMaskAt(1,false);
            rctx.setFBOAttachmentMaskAt(2,true);
            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true);
            renderer.runAt(0);
            renderer.updateCameraDataFromCamera( camList.getAt(3) );
            rctx.setFBOAttachmentMaskAt(2,false);
            rctx.setFBOAttachmentMaskAt(3,true);
            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true, false);
            renderer.runAt(0);
        
            renderer.updateCameraDataFromCamera( camList.getAt(4) );
            rctx.setFBOAttachmentMaskAt(3,false);
            rctx.setFBOAttachmentMaskAt(4,true);
            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true, false);
            renderer.runAt(0);
            renderer.updateCameraDataFromCamera( camList.getAt(5) );
            rctx.setFBOAttachmentMaskAt(4,false);
            rctx.setFBOAttachmentMaskAt(5,true);
            rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
            rctx.useFBO(true, true, false);
            renderer.runAt(0);

            //*/

            this.setDispVisible(true);
        }
    }
}