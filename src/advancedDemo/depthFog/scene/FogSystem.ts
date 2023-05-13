/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";
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

import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import {FogPlaneConeFactorMaterial} from "../../../advancedDemo/depthLight/material/FogPlaneConeFactorMaterial";
import {FogUnit} from "../../../advancedDemo/depthLight/scene/FogUnit";

export class FogSystem {
    constructor() {
    }

    private m_rc: RendererScene = null;
    private m_rct: IRendererInstanceContext = null;

    private m_middleFBO: FBOInstance = null;
    private m_factorFBO: FBOInstance = null;
    private m_stage3D: Stage3D = null;

    texLoader: ImageTextureLoader = null;
    factorPlaneIndex: number = 0;
    maxRadius: number = 800.0;
    factorPlane: Plane3DEntity;
    //fogFactorM:FogPlaneGeomFactorMaterial;
    fogFactorM: FogPlaneConeFactorMaterial;
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
        console.log("DepthLight FosSystem initFog.");
        let i: number = 0;
        let rState0: number = RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
        let rState1: number = RendererState.BACK_TRANSPARENT_ALWAYS_STATE;
        this.maxRadius = 800.0;//141.25;
        let baseRadius: number = this.maxRadius;
        let fogUnit: FogUnit;
        for (i = 0; i < 1; ++i) {
            fogUnit = new FogUnit();
            if (Math.random() > 0.9) fogUnit.rstate = rState0;
            else fogUnit.rstate = rState1;
            fogUnit.topPos.setXYZ(0.0, 800.0, 0.0);
            fogUnit.coneRadius = 150.0;
            fogUnit.initRandom(baseRadius, 2000.0);
            fogUnit.radius = baseRadius;
            fogUnit.pos.setXYZ(0.0, 0.0, 0.0);
            fogUnit.fogColor.setRGB3f(1.0, 1.0, 1.0);
            fogUnit.factorColor.setRGB3f(1.0, 1.0, 1.0);
            fogUnit.update();
            this.m_fogUnits.push(fogUnit);
        }

        let tex3: TextureProxy = this.getImageTexByUrl("displacement_03.jpg");
        //this.fogFactorM = new FogPlaneGeomFactorMaterial();
        this.fogFactorM = new FogPlaneConeFactorMaterial();
        this.factorPlane = new Plane3DEntity();
        this.factorPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        //this.factorPlane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        this.factorPlane.setMaterial(this.fogFactorM);
        this.factorPlane.initializeXOY(
            -0.5, -0.5, 1.0, 1.0
            , [
                this.m_middleFBO.getRTTAt(1)
                , tex3
            ]
        );
        this.m_rc.addEntity(this.factorPlane, this.m_factorFBO.getRProcessIDAt(0));
    }
    private m_pv: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();
    private m_rectV: Vector3D = new Vector3D();
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
        let len: number = this.m_fogUnits.length;
        if (len > 0) {
            let outV: Vector3D = this.m_outV;
            let pv: Vector3D = this.m_pv;
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
            let vmat: any = cam.getViewMatrix();
            for (let i: number = 0; i < len; ++i) {
                fogUnit = this.m_fogUnits[i];
                this.m_pv.copyFrom(fogUnit.pos);
                this.m_pv.w = 1.0;
                if (fogUnit.isAlive() && cam.visiTestSphere3(this.m_pv, fogUnit.radius, -fogUnit.radius * 2.0)) {
                    this.m_pv.copyFrom(fogUnit.pos);
                    cam.calcScreenRectByWorldSphere(this.m_pv, fogUnit.radius, outV);
                    //  if(outV.x > 1.0 || outV.y > 1.0 || (outV.x + outV.z) < -1.0 || (outV.y + outV.w) < -1.0)
                    //  {
                    //      continue;
                    //  }
                    //this.m_esc.factorPlane.setRenderState(fogUnit.rstate);
                    this.factorPlane.setXYZ(outV.x + outV.z * 0.5, outV.y + outV.w * 0.5, 0.0);
                    this.factorPlane.setScaleXYZ(outV.z, outV.w, 1.0);
                    this.factorPlane.update();
                    // 将fog factor 写入到目标tex buf
                    vmat.transformOutVector3(fogUnit.pos, pv);
                    this.fogFactorM.setRadius(fogUnit.radius);
                    this.fogFactorM.setXYZ3f(pv.x, pv.y, pv.z);

                    vmat.transformOutVector3(fogUnit.topPos, pv);
                    vmat.transformOutVector3(fogUnit.bottomPos, outV);
                    this.fogFactorM.setConePos(pv, outV);
                    this.fogFactorM.setConeMCos(fogUnit.mcos);
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