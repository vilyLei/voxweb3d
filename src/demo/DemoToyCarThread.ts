import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import { UserInteraction } from "../vox/engine/UserInteraction";

import { ToyCarScene } from "./thread/toyCar/scene/ToyCarScene";

import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Color4 from "../vox/material/Color4";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Matrix4 from "../vox/math/Matrix4";
import MathConst from "../vox/math/MathConst";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";

export class DemoToyCarThread extends DemoInstance implements IShaderLibListener {
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_userInteraction: UserInteraction = new UserInteraction();

    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    private m_toyCarScene: ToyCarScene = new ToyCarScene();

    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        // param.maxWebGLVersion = 1;
        param.setCamProject(45.0, 80.0, 3500.0);
        param.setMatrix4AllocateSize(4096 * 4);
        param.setCamPosition(500.0, 500.0, 500.0);
    }

    protected initializeSceneObj(): void {

        let rscene = this.m_rscene;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        //rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        //rscene.entityBlock = entityBlock;

        console.log("DemoToyCarThread::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDevice.SHADERCODE_TRACE_ENABLED = true;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        if (this.m_profileInstance != null) this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        if (this.m_statusDisp != null) this.m_statusDisp.initialize();

        this.m_userInteraction.initialize(this.m_rscene);


        this.update();
        //this.initScene();
        this.initMaterialCtx();
    }

    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 0;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 0;
        mcParam.pbrMaterialEnabled = false;
        //mcParam.vsmEnabled = false;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);

        let lightModule = this.m_materialCtx.lightModule;
        let direcLight = lightModule.getDirectionLightAt(0);
        direcLight.direction.setXYZ(-0.5, -0.5, 0.5);


        // let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        // pointLight.position.setXYZ(0.0, 150.0, -50.0);
        // pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        // pointLight.attenuationFactor1 = 0.00001;
        // pointLight.attenuationFactor2 = 0.000001;

        this.m_materialCtx.lightModule.update();
    }

    private applyMaterial(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = false, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        material.setMaterialPipeline(this.m_materialCtx.pipeline);

        material.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        material.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            material.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            material.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if (material.vertUniform != null) {
                //material.vertUniform.displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }        
        material.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private m_material: LambertLightMaterial;
    private initScene(): void {


        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_toyCarScene.initialize(this.m_rscene, this.m_materialCtx);

        // let axis: Axis3DEntity = new Axis3DEntity();
        // axis.initialize(300.0);
        // // axis.setXYZ(0, 30, 0);
        // this.m_rscene.addEntity(axis);

        // let tex0 = this.m_materialCtx.getTextureByUrl("static/assets/metal_02.jpg");
        // let material: LambertLightMaterial = this.m_materialCtx.createLambertLightMaterial();
        // material.fogEnabled = false;
        // material.vtxUVTransformEnabled = true;
        // material.diffuseMap = tex0;
        // this.m_material = material;
        // let transMat4: Matrix4 = new Matrix4();
        // transMat4.appendRotationEulerAngle(0.0,0.0, MathConst.DegreeToRadian(90.0));
        // let cyl: Cylinder3DEntity = new Cylinder3DEntity();
        // cyl.uScale = 12.0;
        // cyl.setMaterial( material );
        // cyl.setVtxTransformMatrix(transMat4);
        // cyl.initialize(100,100, 30, [tex0], 0);
        // this.m_rscene.addEntity( cyl );

        // // let material: LambertLightMaterial = this.m_materialCtx.createLambertLightMaterial();
        // // material.fogEnabled = false;
        // // material.diffuseMap = tex0;
        // //  let material: Default3DMaterial = new Default3DMaterial();
        // //  material.vertColorEnabled = true;
        // let box: Box3DEntity = new Box3DEntity();
        // box.vtxColor = new Color4(1.0,0.2,0.2,1.0);
        // box.initializeCube(100, [tex0]);
        // this.m_rscene.addEntity( box );
    }
    private m_downFlag: number = 0;
    private mouseDown(evt: any): void {
        this.m_downFlag++;
        this.m_userInteraction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_userInteraction.viewRay.position;
        this.m_toyCarScene.testDose(pv);
    }
    private m_timeoutId: any = -1;
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps

        this.m_toyCarScene.run();
        this.m_toyCarScene.updateThread();
    }
    runBegin(): void {

        this.m_userInteraction.run();

        if (this.m_statusDisp != null) this.m_statusDisp.update();

    }
    private m_dv: Vector3D = new Vector3D();
    run(): void {
        // if (this.m_material != null) {
        //     this.m_material.vertUniform.setUVTranslation(this.m_dv.x, this.m_dv.y);
        //     this.m_dv.x += 0.05;
        // }
        ThreadSystem.Run();

        this.m_rscene.run();

        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
    runEnd(): void {
    }
}
export default DemoToyCarThread;