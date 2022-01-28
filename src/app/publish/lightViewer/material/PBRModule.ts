import IRenderMaterial from "../../../../vox/render/IRenderMaterial";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { MaterialPipeType } from "../../../../vox/material/pipeline/MaterialPipeType";
import { IEnvLightModule } from "../../../../light/base/IEnvLightModule";
import { IMaterialPipeline } from "../../../../vox/material/pipeline/IMaterialPipeline";
import { IAppEngine } from "../../../modules/interfaces/IAppEngine";
import { IAppBase } from "../../../modules/interfaces/IAppBase";
import Vector3D from "../../../../vox/math/Vector3D";
import { IMaterialContext } from "../../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../../vox/material/IMaterial";
import Color4 from "../../../../vox/material/Color4";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import IObjGeomDataParser from "../../../../vox/mesh/obj/IObjGeomDataParser";
import { IDataMesh } from "../../../../vox/mesh/IDataMesh";
import { IAppPBR } from "../../../modules/interfaces/IAppPBR";
import BinaryLoader from "../../../../vox/assets/BinaryLoader"
import { ShaderCodeUUID } from "../../../../vox/material/ShaderCodeUUID";
import IMaterialModule from "./IMaterialModule";
import IRenderTexture from "../../../../vox/render/texture/IRenderTexture";
import DivLog from "../../../../vox/utils/DivLog";

declare var AppBase: any;
declare var AppPBR: any;

export default class PBRModule implements IMaterialModule {

    private m_rscene: IRendererScene;
    private m_appPBR: IAppPBR = null;
    private m_materialCtx: IMaterialContext;
    private m_preLoadMaps: boolean = true;
    private m_loadSpecularData: boolean = true;
    private m_specEnvMapbuffer: ArrayBuffer = null;
    private m_specEnvMap: IRenderTexture = null;

    constructor() { }

    preload(): void {
        this.loadSpecularData(true);
    }
    active(rscene: IRendererScene, materialCtx: IMaterialContext): void {

        this.m_materialCtx = materialCtx;
        if (this.m_appPBR == null) {
            this.m_rscene = rscene;
            this.m_appPBR = new AppPBR.Instance() as IAppPBR;
            this.m_appPBR.initialize(this.m_rscene);
        }
        this.preloadMap(this.m_materialCtx, "box", true, false, true);
        // if(this.m_specEnvMapbuffer != null && this.m_specEnvMap == null && this.m_appPBR != null) {
        //     this.m_specEnvMap = this.m_appPBR.createSpecularTex(this.m_specEnvMapbuffer, true, this.m_specEnvMap);
        // }
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        this.m_specEnvMapbuffer = buffer;
        if(this.m_appPBR != null) {
            this.m_specEnvMap = this.m_appPBR.createSpecularTex(this.m_specEnvMapbuffer, true, this.m_specEnvMap);
        }
    }
    loadError(status: number, uuid: string): void {
    }
    private loadSpecularData(hdrBrnEnabled: boolean): void {

        if(this.m_loadSpecularData) {
            let envMapUrl: string = "static/bytes/spe.mdf";
            if (hdrBrnEnabled) {
                envMapUrl = "static/bytes/spb.bin";
            }
            console.log("start load spec map ata.");
            let load = new BinaryLoader();
            load.load(envMapUrl, this);
            this.m_loadSpecularData = false;
        }
    }
    private preloadMap(materialCtx: IMaterialContext, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        if (this.m_preLoadMaps) {

            let ns: string = "rust_coarse_01";
            ns = "medieval_blocks_02";
            ns = "rough_plaster_broken";
            //ns = "metal_plate";

            this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_diff_1k.jpg");
            this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_nor_1k.jpg");
            this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_arm_1k.jpg");

            this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_disp_1k.jpg");

            this.m_preLoadMaps = false;
        }
    }
    private useMaps(decorator: any, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        decorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        decorator.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            decorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            decorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if (decorator.vertUniform != null) {
                decorator.vertUniform.displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        decorator.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    getUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.PBR;
    }
    isEnabled(): boolean {
        let boo = this.m_materialCtx != null && this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID());
        // DivLog.ShowLog("pbr isEnabled: "+boo);
        return boo;// && this.m_specEnvMapbuffer != null;
    }
    createMaterial(): IMaterial {
        // console.log("### pbr createMaterial().");
        if (this.m_specEnvMap == null) {
            this.m_specEnvMap = this.m_appPBR.createSpecularTex(this.m_specEnvMapbuffer, true, this.m_specEnvMap);
        }
        // DivLog.ShowLog("pbr createMaterial, uid: "+this.m_specEnvMap.getUid());
        let diffuseMap: IRenderTexture = null;
        let normalMap: IRenderTexture = null;
        let armMap: IRenderTexture = null;
        let aoMap: IRenderTexture = null;
        let aoMapEnabled: boolean = true;
        let fogEnabled: boolean = true;
        let ns: string = "rust_coarse_01";
        ns = "medieval_blocks_02";
        ns = "rough_plaster_broken";
        //ns = "metal_plate";

        diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_diff_1k.jpg");
        //diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
        normalMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_nor_1k.jpg");
        armMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_arm_1k.jpg");

        if (aoMapEnabled) {
            //aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
            //aoMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        }
        let displacementMap: IRenderTexture = null;
        displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_disp_1k.jpg");
        let parallaxMap: IRenderTexture = null;
        //parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/brick_bumpy01.jpg");
        parallaxMap = displacementMap;

        let param: any = { diffuseMap: diffuseMap, normalMap: normalMap, armMap: armMap, displacementMap: displacementMap, parallaxMap: parallaxMap };
        param.metallic = 1.0;
        param.roughness = 0.4;
        param.ao = 1.0;
        param.specularEnvMap = this.m_specEnvMap;
        param.shadowReceiveEnabled = true;

        param.fogEnabled = fogEnabled;

        let m = this.m_appPBR.createMaterial();
        let decor: any = m.getDecorator();
        let vertUniform: any = decor.vertUniform;

        m.setMaterialPipeline(this.m_materialCtx.pipeline);

        decor.scatterEnabled = false;
        decor.woolEnabled = true;
        decor.absorbEnabled = false;
        decor.normalNoiseEnabled = false;

        decor.setMetallic(param.metallic);
        decor.setRoughness(param.roughness);
        decor.setAO(param.ao);

        decor.shadowReceiveEnabled = param.shadowReceiveEnabled;
        decor.fogEnabled = param.fogEnabled;

        decor.armMap = param.armMap;
        decor.specularEnvMap = param.specularEnvMap;
        decor.diffuseMap = param.diffuseMap;
        decor.normalMap = param.normalMap;
        decor.aoMap = param.aoMap;
        vertUniform.displacementMap = param.displacementMap;
        decor.parallaxMap = param.parallaxMap;

        decor.initialize();
        vertUniform.initialize();

        //vertUniform.setDisplacementParams(10.0, -5.0);
        vertUniform.setDisplacementParams(0.02, -0.01);
        decor.setAlbedoColor(1.0, 1.0, 1.0);
        decor.setScatterIntensity(8.0);
        decor.setParallaxParams(1, 10, 5.0, 0.02);
        decor.setSideIntensity(8.0);

        //m.initializeByCodeBuf( true );
        return m;
    }
}