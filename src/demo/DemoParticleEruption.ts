
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import CameraViewRay from "../vox/view/CameraViewRay";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import EruptionEffectPool from "../particle/effect/EruptionEffectPool";
import EruptionSmokePool from "../particle/effect/EruptionSmokePool";

import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import Billboard3DGroupEntity from "../vox/entity/Billboard3DGroupEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { UserInteraction } from "../app/engine/UserInteraction";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

export class DemoParticleEruption {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;

    private m_axis: Axis3DEntity = null;
    private m_textures: IRenderTexture[] = null;
    private m_eff0Pool: EruptionEffectPool = null;
    private m_eff1Pool: EruptionSmokePool = null;
    private m_viewRay = new CameraViewRay();

    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    private m_posList: Vector3D[] = [new Vector3D(0, 0, 0, 40), new Vector3D(100, 0, 100, 50)];
    private getAssetTexByUrl(pns: string): IRenderTexture {
        return this.getTexByUrl("static/assets/" + pns);
    }
    private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        let hostUrl = window.location.href;
        if (hostUrl.indexOf(".artvily.") > 0) {
            hostUrl = "http://www.artvily.com:9090/";
            url = hostUrl + url;
        }
        return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 3;
        mcParam.directionLightsTotal = 0;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        mcParam.pbrMaterialEnabled = false;
        mcParam.vsmEnabled = false;
        //mcParam.buildBinaryFile = true;

        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);
        this.m_materialCtx.envLightModule.setFogDensity(0.0003);
        this.m_materialCtx.lightModule.update();
    }
    initialize(): void {
        let boo0: any = true;
        let boo1: any = false;
        console.log("DemoParticleEruption::initialize()......: " + (boo0 + boo1));
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setAttriAlpha(false);
            rparam.setCamProject(45.0, 10.0, 8000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.setRendererProcessParam(1, true, true);

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            //rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            //rscene.entityBlock = entityBlock;

            this.m_viewRay.initialize(this.m_rscene);
            this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            new RenderStatusDisplay(this.m_rscene, true).setParams(true);
            new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
            /*
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(100.0);
            axis.setXYZ(100.0, 0.0, 100.0);
            this.m_rscene.addEntity(axis);
            this.m_axis = axis;

            axis = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);

            //*/

            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.initMaterialCtx();
            this.update();
        }
    }

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        // this.m_materialCtx.envData.setAmbientColorRGB3f(3.0,3.0,3.0);
        // this.m_materialCtx.envData.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        // this.m_materialCtx.envData.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        // this.m_materialCtx.envData.setEnvAmbientMap( this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg") );
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private initScene(): void {

        // let textures = this.m_textures;
        ///*
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.pipeTypes = [MaterialPipeType.FOG_EXP2];
        plane.setMaterialPipeline(this.m_materialCtx.pipeline);
        plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [this.getTexByUrl("static/assets/wood_02.jpg")]);
        plane.setXYZ(0.0, -80.0, 0.0);
        this.m_rscene.addEntity(plane);

        // plane = new Plane3DEntity();
        // plane.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // plane.setMaterialPipeline(this.m_materialCtx.pipeline);
        // plane.initializeXOZ(-800.0, -800.0, 1600.0, 1600.0, [textures[0]]);
        // plane.setXYZ(0.0, -280.0, 0.0);
        // this.m_rscene.addEntity(plane);
        //*/
        this.initEnvBox();

        //this.initializeEffect();
        //this.initBillGroup();

        this.applyEffectWithPos(new Vector3D(-150, 0, -150));
    }

    private initEnvBox(): void {

        let envBox = new Box3DEntity();
        envBox.pipeTypes = [MaterialPipeType.FOG_EXP2];
        envBox.setMaterialPipeline(this.m_materialCtx.pipeline);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0, [this.m_materialCtx.getTextureByUrl("static/assets/box_wood01.jpg")]);
        this.m_rscene.addEntity(envBox, 1);
    }

    private m_effInited: boolean = true;
    private initializeEffect(): void {
        if (this.m_effInited) {

            if (this.m_eff0Pool == null) {
                let texFlame = this.getTexByUrl("static/assets/testEFT4.jpg");
                //let texSolid: TextureProxy = this.m_textures[3];
                //let texSolid: TextureProxy = this.getImageTexByUrl("static/assets/stones_02.png");
                let texSolid = this.getTexByUrl("static/assets/stones_04.png");
                this.m_eff0Pool = new EruptionEffectPool();
                this.m_eff0Pool.solidCN = this.m_eff0Pool.solidRN = 2;
                this.m_eff0Pool.materialPipeline = this.m_materialCtx.pipeline;
                this.m_eff0Pool.pipeTypes = [MaterialPipeType.FOG_EXP2];
                this.m_eff0Pool.solidPremultiplyAlpha = true;
                this.m_eff0Pool.initialize(this.m_rscene, 3, 60, 50, texFlame, texSolid, true);
                //  this.m_eff0Pool.createEffect(null);
            }
            // if (this.m_eff1Pool == null) {
            //     let texture: TextureProxy = this.m_textures[9];
            //     let colorTexture: TextureProxy = this.m_textures[10];
            //     this.m_eff1Pool = new EruptionSmokePool();
            //     this.m_eff1Pool.materialPipeline = this.m_materialCtx.pipeline;
            //     this.m_eff1Pool.pipeTypes = [MaterialPipeType.FOG_EXP2];
            //     this.m_eff1Pool.initialize(this.m_rscene, 3, 10, texture, colorTexture, true);
            //     //  this.m_eff1Pool.createEffect(null);
            // }
            this.m_effInited = false;
        }
    }
    private getUVParamsByRNCN(rn: number, cn: number): number[][] {

        let dw: number = 1.0 / cn;
        let dh: number = 1.0 / rn;
        let trn: number = rn;
        let tcn: number = cn;
        let params: number[][] = [];
        for (let i: number = 0; i < rn; ++i) {
            for (let j: number = 0; j < cn; ++j) {
                params.push([j * dw, i * dh, dw, dh]);
            }
        }
        return params;
    }
    private initBillGroup(): void {

        let size: number = 100;
        let params: number[][] = this.getUVParamsByRNCN(4, 4);
        let tex = this.getTexByUrl("static/assets/xulie_02_07.png");
        let total: number = 150;
        let billGroup: Billboard3DGroupEntity = new Billboard3DGroupEntity();
        billGroup.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billGroup.setMaterialPipeline(this.m_materialCtx.pipeline);
        billGroup.toBrightnessBlend();
        //billGroup.toTransparentBlend();
        billGroup.createGroup(total);
        for (let i: number = 0; i < total; ++i) {
            size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAt(i, size, size);
            //  billGroup.setUVRectAt(i, 0.0,0.0, 0.5,0.5);
            let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
            billGroup.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
            //billGroup.setPositionAt(i,0.0,0.0,0.0);
            billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
        }
        billGroup.initialize([tex]);
        this.m_rscene.addEntity(billGroup, 2);
    }
    private applyEffectWithPos(pv: Vector3D): void {

        this.initializeEffect();
        if (this.m_eff0Pool != null || this.m_eff1Pool != null) {

            //this.m_eff0Pool.createEffect(viewRay.position);
            // this.m_eff1Pool.createEffect(viewRay.position);
            //return;

            if (Math.random() > -0.5) {
                if (this.m_eff0Pool != null) this.m_eff0Pool.createEffect(pv);
            }
            else {
                if (this.m_eff1Pool != null) this.m_eff1Pool.createEffect(pv);
            }
        }
    }
    mouseDownListener(evt: any): void {
        //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
        let viewRay = this.m_viewRay;
        viewRay.intersectPlane();
        this.applyEffectWithPos(viewRay.position);
    }
    private m_timeoutId: any = -1;
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 20);// 50 fps

        if (this.m_eff0Pool != null) {
            this.m_eff0Pool.run();
        }
        if (this.m_eff1Pool != null) {
            this.m_eff1Pool.run();
        }
        if (this.m_posList.length > 0) {
            let pv = this.m_posList[0];
            if (pv.w < 0) {
                this.m_posList.shift();
                this.applyEffectWithPos(pv);
            } else {
                pv.w -= 1.0;
            }
        }
    }
    run(): void {
        this.m_rscene.run();
    }
}
export default DemoParticleEruption;
