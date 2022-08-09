import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import Color4 from "../../../vox/material/Color4";
import { ILambertEffectInstance, ILambertEffect } from "./ILambertEffect";
import BinaryLoader from "../../../vox/assets/BinaryLoader"
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IMaterialModule from "../../voxengine/material/IMaterialModule";

declare var LambertEfect: ILambertEffect;

export default class LambertModule implements IMaterialModule {

    private m_rscene: IRendererScene;
    private m_lambert: ILambertEffectInstance = null;
    private m_materialCtx: IMaterialContext;
    private m_preLoadMaps: boolean = true;

    constructor() { }

    preload(): void {
    }
    active(rscene: IRendererScene, materialCtx: IMaterialContext): void {

        console.log("LambertModule active...");
        this.m_materialCtx = materialCtx;
        if (this.m_lambert == null) {
            this.m_rscene = rscene;
            this.m_lambert = LambertEfect.create();
            this.m_lambert.initialize(this.m_rscene);
        }
        this.preloadMap(this.m_materialCtx, "box", true, false, true);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded spec map ata.");
    }
    loadError(status: number, uuid: string): void {
    }
    loadSpecularData(hdrBrnEnabled: boolean): void {
        let envMapUrl: string = "static/bytes/spe.mdf";
        if (hdrBrnEnabled) {
            envMapUrl = "static/bytes/speBrn.bin";
        }
        console.log("start load spec map ata.");
        let load = new BinaryLoader();
        load.load(envMapUrl, this);
    }
    private preloadMap(materialCtx: IMaterialContext, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        if (this.m_preLoadMaps) {

            this.m_preLoadMaps = false;
            materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
            materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
            if (normalMapEnabled) {
                materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
            }
            if (aoMapEnabled) {
                materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
            }
            if (displacementMap) {
            }
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
        return ShaderCodeUUID.Lambert;
    }
    createMaterial(): IMaterial {

        let m = this.m_lambert.createMaterial();
        let decor: any = m.getDecorator();
        let vertUniform = decor.vertUniform;
        m.setMaterialPipeline(this.m_materialCtx.pipeline);
        decor.envAmbientLightEnabled = true;

        vertUniform.uvTransformEnabled = true;
        this.useMaps(decor, "box", true, false, true);
        decor.fogEnabled = true;
        decor.lightEnabled = true;
        decor.initialize();
        vertUniform.setDisplacementParams(3.0, 0.0);
        // material.setDisplacementParams(3.0, 0.0);
        decor.setSpecularIntensity(64.0);

        let color = new Color4();
        color.normalizeRandom(1.1);
        decor.setSpecularColor(color);
        return m;
    }
    isEnabled(): boolean {
        // console.log("LambertModule::this.m_materialCtx.hasShaderCodeObjectWithUUID("+this.getUUID()+"): ",this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID()));
        return this.m_materialCtx != null && this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID());
    }
}