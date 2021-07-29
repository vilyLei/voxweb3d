
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import ClipsBillboard3DEntity from "../../vox/entity/ClipsBillboard3DEntity";

import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
//import TextureProxy from "../../vox/texture/TextureProxy";
import ImageCubeTextureProxy from "../../vox/texture/ImageCubeTextureProxy";
import RendererScene from "../../vox/scene/RendererScene";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import FrameBufferType from "../../vox/render/FrameBufferType";
import FBOInstance from "../../vox/scene/FBOInstance";
class CameraList {
    private m_cams: CameraBase[] = null;
    private m_initFlag: boolean = true;
    getAt(i: number): CameraBase {
        return this.m_cams[i];
    }

    create(posV: Vector3D, pw: number, ph: number): void {

        if (this.m_initFlag) {
            this.m_cams = [
                new CameraBase(0), new CameraBase(0), new CameraBase(0),
                new CameraBase(0), new CameraBase(0), new CameraBase(0)
            ];

            let fov: number = 90.0;
            let dis: number = 300.0;
            let fovAngRad: number = MathConst.DegreeToRadian(fov);
            let near: number = 1.0;
            let far: number = 5000.0;
            
            let kaspect: number = pw / ph;
            
            this.m_cams[0].lookAtRH(posV, new Vector3D(posV.x - dis, posV.y + 0.0, posV.z + 0.0), new Vector3D(0, -1, 0));
            this.m_cams[1].lookAtRH(posV, new Vector3D(posV.x - dis, posV.y + 0.0, posV.z + 0.0), new Vector3D(0, -1, 0));
            this.m_cams[2].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + dis, posV.z + 0.0), new Vector3D(0, 0, 1));
            this.m_cams[3].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y - dis, posV.z + 0.0), new Vector3D(0, 0, -1));
            this.m_cams[4].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z + dis), new Vector3D(0, -1, 0));
            this.m_cams[5].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z - dis), new Vector3D(0, -1, 0));

            for(let i: number = 0; i < 6; ++i) {
                this.m_cams[i].perspectiveRH(fovAngRad, kaspect, near, far);
                this.m_cams[i].update();
            }
            this.m_initFlag = false;
        }
    }
}

export default class CubeRTTScene {
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
    private m_fboIns: FBOInstance = null;
    private m_initFbo: boolean = true;
    mipmapEnabled: boolean = false;
    constructor() {
        this.m_id = CubeRTTScene.s_id++;
    }
    initialize(sc: RendererScene, pw: number, ph: number,centerV: Vector3D = null): void {
        this.m_texW = pw;
        this.m_texH = ph;
        this.m_rscene = sc;
        if (this.m_camList == null) {
            this.m_camList = new CameraList();
            this.m_initFlag = false;
            if(centerV == null) {
                centerV = new Vector3D(0.0, 0.0, 0.0);
            }
            this.m_camList.create(centerV, this.m_texW, this.m_texH);

            
            let rctx: RendererInstanceContext = this.m_rscene.getRendererContext();
            rctx.createFBOAt(0, FrameBufferType.FRAMEBUFFER, this.m_texW, this.m_texH, true, false, 0);

            this.m_fboIns = this.m_rscene.createFBOInstance();
            this.m_fboIns.asynFBOSizeWithViewport();
            this.m_fboIns.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
            this.m_fboIns.createFBOAt(0, this.m_texW, this.m_texH, true, false);
            this.m_fboIns.setRenderToTexture(this.getCubeTexture(), 0);          // framebuffer color attachment 0
            this.m_fboIns.setRProcessIDList([0]);
        }
    }
    getId(): number {
        return this.m_id;
    }
    /*
    enableMipmap(): void {
        if (this.m_texProxy != null) {
            this.mipmapEnabled = true;
            this.m_texProxy.enableMipmap();
        }
    }
    disableMipmap(): void {        
        if (this.m_texProxy != null) {
            this.mipmapEnabled = false;
            this.m_texProxy.disableMipmap();
        }
    }
    //*/
    getCubeTexture(): RTTTextureProxy {
        if (this.m_texProxy == null) {
            //this.m_texProxy = this.m_rscene.textureBlock.createCubeRTTTextureAt(0, 128,128);
            this.m_texProxy = new RTTTextureProxy(128, 128);
            this.m_texProxy.toCubeTexture();
            if (this.mipmapEnabled) {
                this.m_texProxy.enableMipmap();
            }
            this.m_texProxy.__$setRenderProxy(this.m_rscene.getRenderProxy());
            this.m_texProxy.name = "CubeRTT" + this.m_id;
        }
        return this.m_texProxy;
    }
    setDispEntity(dispEntity: DisplayEntity) {
        this.m_tarEntity = dispEntity;
    }
    setDispVisible(boo: boolean): void {
        this.m_tarEntity.setVisible(boo);
    }
    getDispVisible(): boolean {
        return this.m_tarEntity.getVisible();
    }
    setEnabled(boo: boolean): void {
        this.m_enabled = boo;
        this.m_tarEntity.setVisible(boo);
    }
    getEnabled(): boolean {
        return this.m_enabled;
    }

    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_fboIns.setClearRGBAColor4f(pr, pb, pg, pa);
    }
    setRProcessIDList(list: number[]): void {
        this.m_fboIns.setRProcessIDList( list );
    }
    private runAttachmentFboIns(i: number, j: number, rpcI: number = 0): void {

        this.m_fboIns.useCamera(this.m_camList.getAt(j));
        this.m_fboIns.setAttachmentMaskAt(i, false);
        this.m_fboIns.setAttachmentMaskAt(j, true);
        this.m_fboIns.renderToTextureAt(0);
        this.m_fboIns.run(false,false,false,false);
        //this.m_fboIns.runAt(rpcI, false);

    }
    private runAttachment(i: number, j: number, rpcI: number = 0): void {

        let renderer = this.m_rscene;
        let rctx: RendererInstanceContext = renderer.getRendererContext();
        renderer.updateCameraDataFromCamera(this.m_camList.getAt(j));
        rctx.setFBOAttachmentMaskAt(i, false);
        rctx.setFBOAttachmentMaskAt(j, true);
        rctx.setRenderToTexture(this.m_texProxy, true, false, 0);
        rctx.useFBO(true, true, false);
        renderer.runAt(rpcI);
    }
    run() {
        if (this.m_enabled) {

            this.setDispVisible(false);
            let fboInsEnabled: boolean = true;
            let rpci: number = 0;
            let i: number = 0;
            let j: number = 0;
            //this.m_fboIns.runBegin();
            //console.log("draw cube face 0.");
            let rctx: RendererInstanceContext = this.m_rscene.getRendererContext();
            if (fboInsEnabled) {
                let fboIns: FBOInstance = this.m_fboIns;
                fboIns.runBegin();
                fboIns.resetAttachmentMask(false);
                for (; j < 6;) {
                    this.runAttachmentFboIns(i, j, rpci);
                    ++j;
                    i = j - 1;
                }
                if (this.mipmapEnabled) {
                    fboIns.generateMipmapTextureAt(0);
                }
                //fboIns.runEnd();
                
            }
            else {
                rctx.setClearRGBColor3f(1.0,1.0,1.0);
                rctx.resetFBOAttachmentMask(false);
                for (; j < 6;) {
                    this.runAttachment(i, j, rpci);
                    ++j;
                    i = j - 1;
                }
                /*
                this.runAttachment(0,0, rpci);
                this.runAttachment(0,1, rpci);
                this.runAttachment(1,2, rpci);
                this.runAttachment(2,3, rpci);
                this.runAttachment(3,4, rpci);
                this.runAttachment(4,5, rpci);
                //*/
                if (this.mipmapEnabled) {
                    this.m_texProxy.generateMipmap(this.m_rscene.getRenderProxy().Texture);
                }
            }
            this.setDispVisible(true);
        }
    }

}