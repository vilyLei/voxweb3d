
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import Vector3D from "../vox/math/Vector3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Color4 from "../vox/material/Color4";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";

import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContext } from "../materialLab/base/MaterialContext";

export class DemoNormalMap {

    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: MaterialContext = new MaterialContext();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {

        console.log("DemoNormalMap::initialize()......");

        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);

            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let color: Color4 = new Color4(1.0,1.0,0.0);
            let colorBias: Color4 = new Color4(0.0,0.0,0.0);

            this.m_materialCtx.initialize( this.m_rscene );
            //this.m_vsmModule = this.m_materialCtx.vsmModule;
            //this.m_materialCtx.pipeline = this.m_materialCtx.pipeline;
            /*
            //*/
            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis);

            let material: LambertLightMaterial = new LambertLightMaterial();
            this.useMaps(material, "metal_08", true, true, true);
            material.fogEnabled = true;
            material.initializeLocalData();
            material.setDisplacementParams(10.0, -10.0);
            color.normalizeRandom(0.5);
            colorBias.randomRGB();
            material.setColor( color, colorBias );
            material.setUVScale(8.0,8.0);
           
            material.setSpecularIntensity(128.0);
            material.setBlendFactor(0.3,0.7);
            color.setRGB3f(1.0,1.0,1.0)
            material.setSpecularColor( color,  );
            let sph: Sphere3DEntity = new Sphere3DEntity();
            sph.setMaterial(material);
            sph.initialize(150.0,100,100);
            sph.setXYZ(0.0, 100.0, 0.0);
            this.m_rscene.addEntity(sph);
            let srcEntity: DisplayEntity = sph;
            ///*
            material = new LambertLightMaterial();
            this.useMaps(material, "lava_03", true, true, true);
            material.fogEnabled = true;
            material.initializeLocalData();
            color.normalizeRandom(1.1);
            colorBias.normalizeRandom(0.5);
            material.setColor( color, colorBias );
            material.setUVScale(4.0,4.0);
            material.setDisplacementParams(10.0, -10.0);
            material.setSpecularColor(new Color4(1.0,1.0,1.0,1.0));
            material.setSpecularIntensity(32);
            //material.setSpecularColor( color );
            sph = new Sphere3DEntity();
            sph.copyMeshFrom(srcEntity);
            sph.setMaterial(material);
            //sph.initialize(150.0,100,100);
            sph.setXYZ(300,0.0,300);
            this.m_rscene.addEntity(sph);
            //*/
            ///*
            material = new LambertLightMaterial();
            this.useMaps(material, "box", true, true, true);
            material.fogEnabled = true;
            material.lightEnabled = true;
            material.initializeLocalData();
            material.setDisplacementParams(3.0,0.0);
            color.normalizeRandom(1.1);
            material.initializeLocalData();
            material.setSpecularIntensity(32.0);
            color.normalizeRandom(1.1);
            //material.setColor( color );
            color.setRGB3f(0.01, 0.01, 0.01);
            material.setSpecularColor( color );
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterial(material);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            plane.setXYZ(0.0, -200.0, 0.0);
            this.m_rscene.addEntity(plane);
            //*/
            /*
            let size: number = 400.0;
            let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
            gridGeom.normalEnabled = true;
            //gridGeom.normalScale = -1.0;
            gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size,size, 120,120);
            //console.log("gridGeom: ", gridGeom);

            let dataMesh: DataMesh = new DataMesh();
            //dataMesh.wireframe = true;
            dataMesh.setBufSortFormat(material.getBufSortFormat());
            dataMesh.initializeFromGeometry(gridGeom);
            
            let entity: DisplayEntity = new DisplayEntity();
            entity.setMaterial(material);
            entity.setMesh(dataMesh);
            entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            //entity.setScaleXYZ(4.0,12.0,4.0);
            //entity.setXYZ(0,-400,0);
            this.m_rscene.addEntity(entity);
            //*/
            this.m_material = material;
            //this.m_material.setDisplacementParams(this.m_dispHeight,0.0);
            
            this.initEnvBox();
            this.update();
            
            // let pl = new ScreenFixedAlignPlaneEntity();
            // pl.initialize(-1.0,-1.0,0.2,0.2,[this.m_materialCtx.vsmModule.getShadowMap()]);
            // this.m_rscene.addEntity(pl, 2);
        }
    }
    private useMaps(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {
        
        material.setMaterialPipeline( this.m_materialCtx.pipeline );

        material.diffuseMap =           this.getImageTexByUrl("static/assets/disp/"+ns+"_COLOR.png");
        material.specularMap =          this.getImageTexByUrl("static/assets/disp/"+ns+"_SPEC.png");
        if(normalMapEnabled) {
            material.normalMap =        this.getImageTexByUrl("static/assets/disp/"+ns+"_NRM.png");
        }
        if(aoMapEnabled) {
            material.aoMap =            this.getImageTexByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        if(displacementMap) {
            material.displacementMap =  this.getImageTexByUrl("static/assets/disp/"+ns+"_DISP.png");
        }
        if(shadowReceiveEnabled) {
            material.shadowMap =        this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
    private initEnvBox(): void {
        
        let material: LambertLightMaterial = new LambertLightMaterial();
        this.useMaps(material, "box", false, false);
        material.fogEnabled = true;

        material.initializeLocalData();
        material.initializeByCodeBuf( true );

        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial( material );
        envBox.showFrontFace();
        envBox.initializeCube(4000.0);
        this.m_rscene.addEntity(envBox);
    }
    private m_dispHeight: number = 10;
    private m_material: LambertLightMaterial = null;
    private mouseDown(evt: any): void {

    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_statusDisp.render();
    }
    private m_time: number = 0.0;
    run(): void {

        this.m_time += 0.01;
        //this.m_material.setDisplacementParams(this.m_dispHeight * (1.0 + Math.cos(this.m_time)), 0.0);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_statusDisp.update(false);

        this.m_materialCtx.run();
        this.m_rscene.run(true);

        // this.m_materialCtx.run();
        // this.m_rscene.update(true);
        // //this.m_vsmModule.force = true;
        // this.m_rscene.run(false);
        // this.m_rscene.runEnd();
    }
}
export default DemoNormalMap;