
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
import RendererScene from "../../vox/scene/RendererScene";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import FrameBufferType from "../../vox/render/FrameBufferType";
import FBOInstance from "../../vox/scene/FBOInstance";

class RTTCameraList {
    private m_cams: CameraBase[] = null;
    private m_initFlag: boolean = true;
    getAt(i: number): CameraBase {
        return this.m_cams[i];
    }

    create(posV: Vector3D, pw: number, ph: number, type: number): void {

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
            
            if(type > 0) {
                //  // camera look at outer
                this.m_cams[0].lookAtRH(posV, new Vector3D(posV.x + dis, posV.y + 0.0, posV.z + 0.0), new Vector3D(0, -1, 0));
                this.m_cams[1].lookAtRH(posV, new Vector3D(posV.x - dis, posV.y + 0.0, posV.z + 0.0), new Vector3D(0, -1, 0));
                this.m_cams[2].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + dis, posV.z + 0.0), new Vector3D(0, 0, 1));
                this.m_cams[3].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y - dis, posV.z + 0.0), new Vector3D(0, 0, -1));
                this.m_cams[4].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z + dis), new Vector3D(0, -1, 0));
                this.m_cams[5].lookAtRH(posV, new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z - dis), new Vector3D(0, -1, 0));
            }
            else {
                // camera look at inner, it is error...
                this.m_cams[0].lookAtRH(new Vector3D(posV.x + dis, posV.y + 0.0, posV.z + 0.0), posV, new Vector3D(0, -1, 0));
                this.m_cams[1].lookAtRH(new Vector3D(posV.x - dis, posV.y + 0.0, posV.z + 0.0), posV, new Vector3D(0, -1, 0));
                this.m_cams[2].lookAtRH(new Vector3D(posV.x + 0.0, posV.y + dis, posV.z + 0.0), posV, new Vector3D(0, 0, 1));
                this.m_cams[3].lookAtRH(new Vector3D(posV.x + 0.0, posV.y - dis, posV.z + 0.0), posV, new Vector3D(0, 0, -1));
                this.m_cams[4].lookAtRH(new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z + dis), posV, new Vector3D(0, -1, 0));
                this.m_cams[5].lookAtRH(new Vector3D(posV.x + 0.0, posV.y + 0.0, posV.z - dis), posV, new Vector3D(0, -1, 0));
            }
            let kaspect: number = pw / ph;
            for(let i: number = 0; i < 6; ++i) {
                this.m_cams[i].perspectiveRH(fovAngRad, kaspect, near, far);
                this.m_cams[i].update();
            }
            this.m_initFlag = false;
        }
    }
}

export default class CubeRttBuilder {
    private static s_id: number = 0;
    private m_id: number = CubeRttBuilder.s_id++;
    private m_tarEntity: DisplayEntity = null;
    private m_initFlag: boolean = true;
    private m_camList: RTTCameraList = null;
    private m_enabled: boolean = true;
    private m_texProxy: RTTTextureProxy = null;
    private m_texW: number = 512.0;
    private m_texH: number = 512.0;
    private m_rscene: RendererScene = null;
    private m_fboIns: FBOInstance = null;
    private m_initFbo: boolean = true;
    mipmapEnabled: boolean = false;
    constructor() {
        this.m_id = CubeRttBuilder.s_id++;
    }
    initialize(sc: RendererScene, pw: number, ph: number,centerV: Vector3D = null, fboIndex: number = 0): void {
        this.m_texW = pw;
        this.m_texH = ph;
        this.m_rscene = sc;
        if (this.m_camList == null) {
            this.m_camList = new RTTCameraList();
            this.m_initFlag = false;
            if(centerV == null) {
                centerV = new Vector3D(0.0, 0.0, 0.0);
            }
            this.m_camList.create(centerV, this.m_texW, this.m_texH, 1);

            let rctx: RendererInstanceContext = this.m_rscene.getRendererContext();
            rctx.createFBOAt(fboIndex, FrameBufferType.FRAMEBUFFER, this.m_texW, this.m_texH, true, false, 0);

            this.m_fboIns = this.m_rscene.createFBOInstance();
            this.m_fboIns.asynFBOSizeWithViewport();
            this.m_fboIns.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);                  // set rtt background clear rgba(r=0.0,g=0.0,b=0.0,0.0) color
            this.m_fboIns.createFBOAt(fboIndex, this.m_texW, this.m_texH, true, false);
            this.m_fboIns.setRenderToTexture(this.getCubeTexture(), 0);             // framebuffer color attachment 0
            this.m_fboIns.setRProcessIDList([0]);
        }
    }
    getId(): number {
        return this.m_id;
    }
    getCubeTexture(): RTTTextureProxy {
        if (this.m_texProxy == null) {
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
    setEnabled(boo: boolean): void {
        this.m_enabled = boo;
        if(this.m_tarEntity != null) {
            this.m_tarEntity.setVisible(boo);
        }
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
            let visible: boolean = false;
            if(this.m_tarEntity != null) {
                visible = this.m_tarEntity.getVisible();
                //this.setDispVisible(false);
                this.m_tarEntity.setVisible(false);
            }
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
                
            }
            else {                
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
            if(this.m_tarEntity != null) {
                //this.setDispVisible(visible);
                this.m_tarEntity.setVisible( visible );
            }
            this.m_rscene.useMainCamera();
        }
    }

}