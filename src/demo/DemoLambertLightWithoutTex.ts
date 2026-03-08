import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import RendererScene from "../vox/scene/RendererScene";
import Vector3D from "../vox/math/Vector3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Color4 from "../vox/material/Color4";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import { SpecularMode, LambertLightMaterial } from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";

export class DemoLambertLightWithoutTex {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    initialize(): void {

        console.log("DemoLambertLightWithoutTex::initialize()......");
        if (this.m_rscene == null)
            return;


        RendererDevice.SHADERCODE_TRACE_ENABLED = true;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

        let rparam: RendererParam = new RendererParam();
        rparam.maxWebGLVersion = 1;
        rparam.setCamProject(45, 10.0, 8000.0);
        rparam.setAttriStencil(true);
        rparam.setAttriAntialias(true);
        rparam.setCamPosition(800.0, 800.0, 800.0);
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize(rparam, 3);
        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

        this.m_statusDisp.initialize();

        this.m_rscene.enableMouseEvent(true);

        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 2;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 2;
        mcParam.vsmEnabled = false;

        this.m_materialCtx.initialize(this.m_rscene, mcParam);
        if (!RendererDevice.IsWinExternalVideoCard() && RendererDevice.IsWindowsPCOS()) {
            alert("当前浏览器3D渲染没有使用独立显卡");
        }
        let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        if (pointLight != null) {
            pointLight.position.setXYZ(-200.0, 56.0, 0.0);
            //pointLight.position.setXYZ(0.0, 56.0, 0.0);
            pointLight.color.setRGB3f(0.0, 1.0, 0.0);
            pointLight = this.m_materialCtx.lightModule.getPointLightAt(1);
            if (pointLight != null) {
                pointLight.position.setXYZ(-200.0, 56.0, -200.0);
                pointLight.color.setRGB3f(0.0, 0.0, 1.0);
            }
        }

        let direcLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
        if (direcLight != null) {
            direcLight.direction.setXYZ(0.0, -1.0, 1.0);
            direcLight.color.setRGB3f(0.7, 0.7, 0.7);
        }
        let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
        if (spotLight != null) {
            spotLight.position.setXYZ(0, 56, 0);
            spotLight.direction.setXYZ(0.0, -1.0, 0.7);
            spotLight.color.setRGB3f(1.0, 0.0, 1.0);
            spotLight = this.m_materialCtx.lightModule.getSpotLightAt(1);
            if (spotLight != null) {
                spotLight.position.setXYZ(100, 56, 0);
                spotLight.direction.setXYZ(0.0, -1.0, -0.7);
                spotLight.color.setRGB3f(1.0, 0.0, 0.0);
            }
        }

        this.m_materialCtx.lightModule.update();
        this.m_materialCtx.lightModule.showInfo();

        let material = new LambertLightMaterial();
        material.setMaterialPipeline(this.m_materialCtx.pipeline);

        material.shadowReceiveEnabled = false;
        material.fogEnabled = false;
        material.lightEnabled = true;
        material.specularMode = SpecularMode.FragColor;
        material.initializeLocalData();
        //material.setSpecularColor(new Color4(0.5,0.5,0.5,1.0));
        material.setSpecularIntensity(64.0);
        material.setLightBlendFactor(0.7, 0.3);
        material.setBlendFactor(0.2, 0.8);
        material.setParallaxParams(1, 5, 2.0, 0.01);

        material.setSpecularColor(new Color4(2.0, 2.0, 2.0));
        material.setColor(new Color4(1.0, 1.0, 1.0, 1.0), new Color4(0.4, 0.4, 0.4));

        let sphMaterial: LambertLightMaterial = new LambertLightMaterial();
        sphMaterial.copyFrom(material);

        let sph = new Sphere3DEntity();
        sph.setMaterial(sphMaterial);
        sph.initialize(100, 20, 20)
        sph.setXYZ(0, -110, 0);
        this.m_rscene.addEntity(sph);

        let boxMaterial: LambertLightMaterial = new LambertLightMaterial();
        boxMaterial.copyFrom(material);
        boxMaterial.setColor(new Color4(1.0, 0.7, 0.5));
        let box = new Box3DEntity();
        box.setMaterial(boxMaterial);
        box.initializeCube(150);
        box.setXYZ(190, -110, -90);
        this.m_rscene.addEntity(box);
    }

    run(): void {

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_statusDisp.update(false);
        this.m_rscene.run(true);

    }
}
export default DemoLambertLightWithoutTex;