/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../../vox/math/Vector3D";
import Stage3D from "../../../vox/display/Stage3D";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../../vox/render/RenderConst";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

import CameraBase from "../../../vox/view/CameraBase";
import RendererState from "../../../vox/render/RendererState";
import { IRendererInstanceContext } from "../../../vox/scene/IRendererInstanceContext";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import {FogMeshGeomFactorMaterial} from "../../../advancedDemo/depthLight/material/FogMeshGeomFactorMaterial";
import {FogUnit} from "../../../advancedDemo/depthLight/scene/FogUnit";


export class FogSphSystem {
    constructor() {
    }

    private m_rc: RendererScene = null;
    private m_rct: IRendererInstanceContext = null;

    private m_middleFBO: FBOInstance = null;
    private m_factorFBO: FBOInstance = null;
    private m_stage3D: Stage3D = null;
    //
    texLoader: ImageTextureLoader = null;
    factorEntityIndex: number = 0;
    maxRadius: number = 800.0;
    //factorEntity:Plane3DEntity;
    factorEntity: Sphere3DEntity;
    fogFactorM: FogMeshGeomFactorMaterial;
    getImageTexByUrl(pns: string): TextureProxy {
        let tex: TextureProxy = this.texLoader.getImageTexByUrl("static/assets/" + pns);
        tex.setWrap(TextureConst.WRAP_REPEAT);
        tex.mipmapEnabled = true;
        return tex;
    }
    initialize(rc: RendererScene, middleFBO: FBOInstance, factorFBO: FBOInstance): void {
        if (this.m_rc == null) {
            this.m_rc = rc;
            this.m_rct = this.m_rc.getRendererContext();
            this.m_stage3D = this.m_rct.getStage3D() as Stage3D;
            this.m_middleFBO = middleFBO;
            this.m_factorFBO = factorFBO;

            this.initFog();
        }
    }
    private m_fogUnits: FogUnit[] = [];
    private initFog(): void {
        let i: number = 0;
        let rState0: number = RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
        let rState1: number = RendererState.BACK_TRANSPARENT_ALWAYS_STATE;
        this.maxRadius = 800.0;//141.25;
        let baseRadius: number = this.maxRadius;
        let fogUnit: FogUnit;
        for (i = 0; i < 80; ++i) {
            fogUnit = new FogUnit();
            if (Math.random() > 0.9) fogUnit.rstate = rState0;
            else fogUnit.rstate = rState1;
            fogUnit.initRandom(baseRadius, 2000.0);
            //  fogUnit.radius = baseRadius * 0.6;
            //  fogUnit.fogColor.setRGB3f(1.0,1.0,1.0);
            //  fogUnit.factorColor.setRGB3f(1.0,1.0,1.0);
            //  fogUnit.pos.setXYZ(0.0,0.0,0.0);
            this.m_fogUnits.push(fogUnit);
        }
        rState0 = RendererState.CreateRenderState("factorSphState", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
        let tex3: TextureProxy = this.getImageTexByUrl("displacement_03.jpg");
        this.fogFactorM = new FogMeshGeomFactorMaterial();
        this.factorEntity = new Sphere3DEntity();
        this.factorEntity.setRenderState(rState0);
        this.factorEntity.setMaterial(this.fogFactorM);
        this.factorEntity.initialize(1.0, 20, 20, [this.m_middleFBO.getRTTAt(1), tex3]);

        this.m_rc.addEntity(this.factorEntity, this.m_factorFBO.getRProcessIDAt(0));
    }
    private m_pv: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();
    private m_status: number = 1;
    setStatus(status: number): void {
        this.m_status = status;
    }
    runBegin(): void {
    }
    runBase(): void {
        // draw middle depth and color
        this.m_middleFBO.unlockRenderState();
        this.m_middleFBO.run();
    }
    getFogVolumesTotal(): number {
        return this.m_fogUnits.length;
    }
    runFog(): void {
        let status: number = this.m_status;
        let outV: Vector3D = this.m_outV;
        let len: number = this.m_fogUnits.length;
        if (len > 0) {
            this.m_factorFBO.unlockMaterial();
            this.m_factorFBO.unlockRenderState();
            this.m_factorFBO.setClearColorEnabled(true);
            this.m_factorFBO.runBegin();
            // for test: select a displaying mode
            //m_fogColors
            switch (status) {
                case 0:
                    this.fogFactorM.setFogDis(this.maxRadius * 5.0);
                    break;
                case 1:
                    this.fogFactorM.setFactorRGB3f(1.0, 1.0, 1.0);
                    this.fogFactorM.setFogDis(this.maxRadius * 1.0);
                    break;
                case 2:
                    this.fogFactorM.setFactorRGB3f(1.0, 1.0, 1.0);
                    this.fogFactorM.setFogDis(this.maxRadius * 2.0);
                    break;
                default:
                    break;

            }
            let fogUnit: FogUnit;
            let cam: CameraBase = this.m_rc.getCamera();
            for (let i: number = 0; i < len; ++i) {
                fogUnit = this.m_fogUnits[i];
                this.m_pv.copyFrom(fogUnit.pos);
                this.m_pv.w = 1.0;
                if (fogUnit.isAlive() && cam.visiTestSphere3(this.m_pv, fogUnit.radius, -fogUnit.radius * 2.0)) {
                    //this.m_esc.factorEntity.setRenderState(fogUnit.rstate);
                    this.factorEntity.setPosition(fogUnit.pos);
                    this.factorEntity.setScaleXYZ(fogUnit.radius, fogUnit.radius, fogUnit.radius);
                    this.factorEntity.update();
                    // 将fog factor 写入到目标tex buf
                    cam.getViewMatrix().transformOutVector3(fogUnit.pos, this.m_pv);

                    this.fogFactorM.setRadius(fogUnit.radius);
                    this.fogFactorM.setXYZ3f(this.m_pv.x, this.m_pv.y, this.m_pv.z);
                    if (status < 1) {
                        this.fogFactorM.setFactorRGBColor(fogUnit.factorColor);
                    }
                    else if (status == 1) {
                        this.fogFactorM.setFogRGBColor(fogUnit.fogColor);
                    }
                    this.m_factorFBO.runAt(0);
                }
            }
        }
    }
}