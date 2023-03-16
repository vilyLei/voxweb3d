
import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import { IRendererInstanceContext } from "../../../vox/scene/IRendererInstanceContext";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";
import MouseEvent from "../../../vox/event/MouseEvent";

import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { FogSphShow2Material } from "../material/FogSphShow2Material";
import { BoxSpaceMotioner } from "../../../voxmotion/primitive/BoxSpaceMotioner";
import { FogFBOMana } from "../../../advancedDemo/depthLight/scene/FogFBOMana";
import { FogSphSystem } from "../../../advancedDemo/depthLight/scene/FogSphSystem";
import { BillParticleGroup } from "../../../advancedDemo/depthLight/scene/BillParticle";

import { RoleScene } from "../../../advancedDemo/depthLight/scene/RoleScene";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";

export class SceneFogFlow {
    constructor() {
    }

    private m_rc: RendererScene = null;
    private m_rct: IRendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader;

    // private m_fogSys: FogSystem = null;
    private m_fogSys: FogSphSystem = null;
    private m_roleSc: RoleScene = null;
    private m_billGroup: BillParticleGroup = null;
    getImageTexByUrl(pns: string): TextureProxy {
        let tex: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/" + pns);
        tex.setWrap(TextureConst.WRAP_REPEAT);
        tex.mipmapEnabled = true;
        return tex;
    }
    private m_dstPlane: Plane3DEntity = null;
    private m_entityRSCIndex: number = 0;
    private m_parIndex: number = 1;
    private m_entityBGIndex: number = 2;
    private m_factorPlaneIndex: number = 4;
    private m_dstPlaneIndex: number = 3;

    fogShow2M: FogSphShow2Material;

    private m_motioners: BoxSpaceMotioner[] = [];
    private m_volMotioners: BoxSpaceMotioner[] = [];
    posList: Vector3D[] = [];
    factorColors: Color4[] = [];
    fogColors: Color4[] = [];
    volumeStates: number[] = [];
    volumeRadiuss: number[] = [];

    middleFBO: FBOInstance = null;
    parFBO: FBOInstance = null;
    factorFBO: FBOInstance = null;

    fboMana: FogFBOMana = null;
    private runmotion(): void {
        let i: number = 0;
        let len: number = this.m_motioners.length;
        for (; i < len; ++i) {
            this.m_motioners[i].update();
            //this.m_motioners[i].getPosition(this.posList[i]);
        }
        i = 0;
        len = this.m_volMotioners.length;
        for (; i < len; ++i) {
            this.m_volMotioners[i].update();
            this.m_volMotioners[i].getPosition(this.posList[i]);
        }
    }
    private m_status: number = 0;
    getStatus(): number {
        return this.m_status;
    }
    mouseDownListener(evt: any): void {
        this.m_status++;
        this.m_fogSys.setStatus(this.m_status);
    }
    initialize(rc: RendererScene): void {
        if (this.m_rc == null) {
            this.m_rc = rc;


            this.m_texLoader = new ImageTextureLoader(rc.textureBlock);
            this.m_rct = this.m_rc.getRendererContext();

            this.m_rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            /*
            this.m_billGroup = new BillParticleGroup();
            let ptex0:TextureProxy = this.getImageTexByUrl("flare_core_02.jpg");
            let ptex1:TextureProxy = this.getImageTexByUrl("a_02_c.jpg");
            this.m_billGroup.texs = [ptex0,ptex1];
            this.m_billGroup.renderer = this.m_rc;
            this.m_billGroup.rendererIndex = this.m_parIndex;
            //*/
            this.m_roleSc = new RoleScene();
            this.m_roleSc.texLoader = this.m_texLoader;
            this.m_roleSc.initialize(this.m_rc);

            this.fboMana = new FogFBOMana();
            this.fboMana.initialize(this.m_rc);

            this.middleFBO = this.fboMana.createMiddleFBO([this.m_entityRSCIndex, this.m_entityBGIndex]);
            this.parFBO = this.fboMana.createParFBO([this.m_parIndex]);
            this.factorFBO = this.fboMana.createFactorFBO([this.m_factorPlaneIndex]);

            this.fogShow2M = new FogSphShow2Material();

            this.fogShow2M.setTextureList(
                [
                    this.middleFBO.getRTTAt(0)
                    , this.factorFBO.getRTTAt(0)
                    , this.factorFBO.getRTTAt(1)
                ]
            );

            this.m_dstPlane = new Plane3DEntity();
            this.m_dstPlane.setMaterial(this.fogShow2M);
            this.m_dstPlane.initializeXOY(
                -1.0, -1.0, 2.0, 2.0
                // -0.5, -0.5, 1.0, 1.0
            );
            this.m_rc.addEntity(this.m_dstPlane, this.m_dstPlaneIndex);

            // this.m_fogSys = new FogSystem();
            this.m_fogSys = new FogSphSystem();
            this.m_fogSys.texLoader = this.m_texLoader;
            this.m_fogSys.initialize(this.m_rc, this.middleFBO, this.factorFBO);

			// let spl = new ScreenFixedAlignPlaneEntity();
			// spl.initialize(-0.8, -0.8, 0.5,0.5, [this.middleFBO.getRTTAt(0)] );
            // this.m_rc.addEntity(spl,  this.m_dstPlaneIndex);

        }
    }
    runBegin(): void {
        // logic run
        this.runmotion();
        // if (this.m_billGroup != null) this.m_billGroup.runAndCreate();
    }
    private m_bgColor = new Color4(0.3, 0.7, 0.6, 1.0);
    renderRun(): void {
        this.m_fogSys.runBase();
        // this.parFBO.unlockMaterial();
        // this.parFBO.unlockRenderState();
        // this.parFBO.run();
        this.m_fogSys.runFog();
        if (this.m_fogSys.getFogVolumesTotal() > 0) {
            //this.m_status
            switch (this.m_status) {
                case 0:
                    this.fogShow2M.setRGB3f(1.0, 1.0, 1.0);
                    break;
                case 1:
                    this.fogShow2M.setRGB3f(1.0, 1.0, 1.0);
                    break;
                case 2:
                    this.fogShow2M.setRGB3f(0.05, 0.1, 0.2);
                    break;
                default:
                    this.fogShow2M.setRGB3f(1.0, 1.0, 1.0);
                    break;

            }
        }

        this.m_rc.setRenderToBackBuffer();
        this.m_rct.unlockMaterial();
        // console.log("this.m_bgColor: ", this.m_bgColor);
        // DebugFlag.Flag_0 = 1;
        this.m_rc.setClearColor(this.m_bgColor);
        this.m_rc.renderBegin(true);
        // dst drawing
		// console.log("this.m_dstPlaneIndex: ", this.m_dstPlaneIndex);
        this.m_rc.runAt(this.m_dstPlaneIndex);
        // this.m_rc.runAt(6);
    }
    runEnd(): void {
    }
}
