
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";
import DashedLine3DEntity from "../vox/entity/DashedLine3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import RendererScene from "../vox/scene/RendererScene";
import BoxGroupTrack from "../voxanimate/primitive/BoxGroupTrack";
import { UserInteraction } from "../vox/engine/UserInteraction";

import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import Box3DEntity from "../vox/entity/Box3DEntity";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import PBRMaterial from "../pbr/material/PBRMaterial";
import MaterialBase from "../vox/material/MaterialBase";
import Color4 from "../vox/material/Color4";

class TrackWheelRole {
    private m_pz: number = Math.random() * 1000.0 - 500.00;
    private m_px: number = Math.random() * 200.0 - 100.00;
    private m_spdx: number = 1.0;
    private m_tspdx: number = 2.0;

    boxTrack: BoxGroupTrack = null;
    maxV: Vector3D = new Vector3D(400.0, 0.0, 0.0);
    minV: Vector3D = new Vector3D(-400.0, 0.0, 0.0);
    constructor() { }
    initialize(): void {
        if (this.boxTrack != null) {
            this.boxTrack.setXYZ(this.m_px, 0.0, this.m_pz);
            let f: number = Math.random() > 0.5 ? 1 : -1;
            this.m_spdx = f * 2.0;
            this.m_tspdx = 2.0 * f;
        }
    }
    run(): void {
        if (this.boxTrack != null) {
            this.boxTrack.moveDistanceOffset(this.m_tspdx * 0.25);
            this.m_px += this.m_spdx;
            if (this.m_spdx > 0 && this.m_px > this.maxV.x) {
                this.m_spdx *= -1.0;
                this.m_tspdx *= -1.0;
            }
            else if (this.m_spdx < 0 && this.m_px < this.minV.x) {
                this.m_spdx *= -1.0;
                this.m_tspdx *= -1.0;
            }
            this.boxTrack.setXYZ(this.m_px, 0.0, this.m_pz);
            this.boxTrack.update();
        }
    }

}

class TrackWheelLightRole {
    private m_pz: number = Math.random() * 1000.0 - 500.00;
    private m_px: number = Math.random() * 200.0 - 100.00;
    private m_spdx: number = 1.0;
    private m_tspdx: number = 2.0;
    private m_distance: number = 0.0;

    trackEntity: DisplayEntity = null;
    trackData: VertUniformComp = null;
    maxV: Vector3D = new Vector3D(400.0, 0.0, 0.0);
    minV: Vector3D = new Vector3D(-400.0, 0.0, 0.0);
    constructor() { }
    initialize(): void {
        if (this.trackEntity != null) {
            this.trackEntity.setXYZ(this.m_px, 0.0, this.m_pz);
            let f: number = Math.random() > 0.5 ? 1 : -1;
            this.m_spdx = f * 2.0;
            this.m_tspdx = 2.0 * f;
        }
    }
    run(): void {
        if (this.trackEntity != null) {
            this.m_distance += this.m_tspdx * 0.25;
            this.trackData.setCurveMoveDistance( this.m_distance );
            this.m_px += this.m_spdx;
            if (this.m_spdx > 0 && this.m_px > this.maxV.x) {
                this.m_spdx *= -1.0;
                this.m_tspdx *= -1.0;
            }
            else if (this.m_spdx < 0 && this.m_px < this.minV.x) {
                this.m_spdx *= -1.0;
                this.m_tspdx *= -1.0;
            }
            this.trackEntity.setXYZ(this.m_px, 0.0, this.m_pz);
            this.trackEntity.update();
        }
    }
}
export class DemoBoxGroupTrack implements IShaderLibListener {

    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_interaction: UserInteraction =  new UserInteraction();
    private m_boxTrack: BoxGroupTrack = new BoxGroupTrack();
    private m_role0: TrackWheelRole = new TrackWheelRole();
    private m_role1: TrackWheelRole = new TrackWheelRole();
    
    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 0;
        mcParam.directionLightsTotal = 2;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        mcParam.pbrMaterialEnabled = false;
        mcParam.vsmEnabled = false;
        //mcParam.buildBinaryFile = true;

        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);
        let colorScale: number = 3.0;
        let lightModule = this.m_materialCtx.lightModule;
        let direcLight = lightModule.getDirectionLightAt(0);
        direcLight.color.setRGB3f(0.3 * colorScale, 1.0 * colorScale, 0.3 * colorScale);
        direcLight.direction.setXYZ(-0.5, -0.5, 0.5);
        direcLight = lightModule.getDirectionLightAt(1);
        direcLight.color.setRGB3f(1.0 * colorScale, 0.3 * colorScale, 0.3 * colorScale);
        direcLight.direction.setXYZ(0.5, -0.5, 0.5);
        this.m_materialCtx.lightModule.update();
    }
    initialize(): void {
        console.log("DemoBoxGroupTrack::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            //rparam.setCamPosition(500.0,500.0,500.0);
            rparam.setCamPosition(1200.0, 1200.0, 1200.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_interaction.initialize( this.m_rscene );

            this.m_statusDisp.initialize();

            //initScene();
            this.initMaterialCtx();
            this.update();
        }
    }
    
    private m_track01: TrackWheelLightRole = null;
    private m_track02: TrackWheelLightRole = null;
    private initScene(): void {

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/image_003.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/box_wood01.jpg");
        this.m_rscene.setClearRGBColor3f(0.1, 0.2, 0.1);

        // let axis: Axis3DEntity = new Axis3DEntity();
        // axis.initialize(310);
        // this.m_rscene.addEntity(axis);

        // let material: LambertLightMaterial;
        // material = this.m_materialCtx.createLambertLightMaterial();
        // material.fogEnabled = false;
        // material.diffuseMap = tex1;
        // material.initializeByCodeBuf(true);
        // material.setBlendFactor(0.5,0.8);

        // let material = this.createPBRMaterial(null,null);
        // let box: Box3DEntity = new Box3DEntity();
        // box.setMaterial(material);
        // box.initializeCube(200.0, [tex1]);
        // this.m_rscene.addEntity(box);

        let material = this.createLambertMaterial(null,null, true);
        let box: Box3DEntity = new Box3DEntity();
        box.vtxColor = new Color4(1.0,0.0,1.0);
        box.setMaterial(material);
        box.initializeCube(200.0, [tex1]);
        this.m_rscene.addEntity(box);
        return;
        //  this.m_boxTrack.setTrackScaleXYZ(0.2,0.2,0.2);
        //  this.m_boxTrack.initialize(this.m_rscene.textureBlock,0.5,[tex0]);
        let distanceFactor: number = 0.98;
        this.m_boxTrack.animator.normalEnabled = true;
        this.m_boxTrack.animator.diffuseMapEnabled = true;
        this.m_boxTrack.setTrackScaleXYZ(0.4, 0.4, 1.0);
        //this.m_boxTrack.setFactor(2,5,2);
        //this.m_boxTrack.initialize(this.m_rscene.textureBlock,0.5,[tex0], distanceFactor);
        this.m_boxTrack.setFactor(5, 5, 5);
        this.m_boxTrack.animator.setGroupPositions([new Vector3D(), new Vector3D(0.0,0.0, 70.0), new Vector3D(0.0,0.0, 140.0)]);
        this.m_boxTrack.initialize(this.m_rscene.textureBlock, 5.0, [tex0], distanceFactor);
        //this.m_boxTrack.setScale(2.2);
        this.m_rscene.addEntity(this.m_boxTrack.animator);

        this.m_role0.boxTrack = this.m_boxTrack;
        this.m_role0.initialize();
        /*
        this.m_role1.boxTrack = boxTrack;
        this.m_role1.initialize();
        //*/

        this.m_track01 = this.createTrackEntity(this.m_boxTrack, tex0);
        this.m_track02 = this.createTrackEntity(this.m_boxTrack, tex0, 1);

        // let boxTrack: BoxGroupTrack = new BoxGroupTrack();
        // boxTrack.initializeFrom(this.m_boxTrack, [tex0]);
        // this.m_rscene.addEntity(boxTrack.animator);

        // let curveLine: DashedLine3DEntity = new DashedLine3DEntity();
        // curveLine.initializeByPosition(this.m_boxTrack.getTrackPosList());
        // this.m_rscene.addEntity(curveLine);
    }
    private createLambertMaterial(boxTrack: BoxGroupTrack, diffuseMap: TextureProxy, vtxColor: boolean = false): LambertLightMaterial {
        let trackMaterial = this.m_materialCtx.createLambertLightMaterial(true);
        trackMaterial.diffuseMap = diffuseMap;
        trackMaterial.vertColorEnabled = vtxColor;
        //trackMaterial.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
        trackMaterial.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        trackMaterial.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        trackMaterial.fogEnabled = false;
        let vertUniform = trackMaterial.vertUniform as VertUniformComp;
        vertUniform.uvTransformEnabled = true;
        trackMaterial.vertUniform = vertUniform;
        if(boxTrack != null) vertUniform.curveMoveMap = boxTrack.animator.getPosDataTexture();
        trackMaterial.initializeByCodeBuf( true );
        trackMaterial.setBlendFactor(0.6, 0.7);
        if(boxTrack != null) vertUniform.setCurveMoveParam(boxTrack.animator.getPosDataTexture().getWidth(), boxTrack.animator.getPosTotal());
        if(boxTrack != null) vertUniform.setCurveMoveDistance(0.0);
        vertUniform.setUVScale(4.0,1.0);
        return trackMaterial;
    }
    private createPBRMaterial(boxTrack: BoxGroupTrack, diffuseMap: TextureProxy): PBRMaterial {

        let trackMaterial = this.m_materialCtx.createPBRLightMaterial(true, true, true);
        trackMaterial.decorator.diffuseMapEnabled = true;
        trackMaterial.decorator.normalMapEnabled = true;
        trackMaterial.decorator.aoMapEnabled = true;
        trackMaterial.decorator.diffuseMap = diffuseMap;
        //trackMaterial.decorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        trackMaterial.decorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        trackMaterial.decorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        trackMaterial.decorator.fogEnabled = false;
        let vertUniform = trackMaterial.vertUniform as VertUniformComp;
        vertUniform.uvTransformEnabled = true;
        trackMaterial.vertUniform = vertUniform;
        if(boxTrack != null) vertUniform.curveMoveMap = boxTrack.animator.getPosDataTexture();
        trackMaterial.initializeByCodeBuf( true );
        trackMaterial.setAmbientFactor(0.1, 0.1, 0.1);
        trackMaterial.setAlbedoColor(2.5, 2.5, 2.5);
        trackMaterial.setRoughness(0.2);
        trackMaterial.setToneMapingExposure(3.0);
        //trackMaterial.setBlendFactor(0.7, 0.7);
        if(boxTrack != null) vertUniform.setCurveMoveParam(boxTrack.animator.getPosDataTexture().getWidth(), boxTrack.animator.getPosTotal());
        if(boxTrack != null) vertUniform.setCurveMoveDistance(0.0);
        vertUniform.setUVScale(4.0,1.0);
        return trackMaterial;
    }
    private createTrackEntity(boxTrack: BoxGroupTrack, diffuseMap: TextureProxy, type: number = 0): TrackWheelLightRole {

        let vertUniform: VertUniformComp;
        let material: MaterialBase;
        if(type == 0) {
            let mt = this.createLambertMaterial(boxTrack, diffuseMap);
            vertUniform = mt.vertUniform as VertUniformComp;
            material = mt;
        }
        else {
            let mt = this.createPBRMaterial(boxTrack, diffuseMap);
            material = mt;
            vertUniform = mt.vertUniform as VertUniformComp;
        }        

        let trackEntity: DisplayEntity = new DisplayEntity();
        trackEntity.setMaterial(material);
        trackEntity.copyMeshFrom( boxTrack.animator );
        this.m_rscene.addEntity( trackEntity );
        let trackRole: TrackWheelLightRole = new TrackWheelLightRole();
        trackRole.trackEntity = trackEntity;
        trackRole.trackData = vertUniform;
        trackRole.initialize();
        return trackRole;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 33 fps
        this.m_statusDisp.render();

        this.m_role0.run();
        // this.m_role1.run();
        
        if(this.m_track01 != null) this.m_track01.run();
        if(this.m_track02 != null) this.m_track02.run();
    }
    run(): void {
        this.m_interaction.run();
        // show fps status
        this.m_statusDisp.update(false);

        this.m_rscene.run();
    }
}
export default { DemoBoxGroupTrack }