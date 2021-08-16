
import TextureProxy from "../../vox/texture/TextureProxy";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import PBREntityUtils from "./PBREntityUtils";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

import Vector3D from "../../vox/math/Vector3D";

import DracoMesh from "../../voxmesh/draco/DracoMesh";
import {DracoTaskListener} from "../../voxmesh/draco/DracoTask";
import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../../thread/ThreadSystem";


export default class PBREntityManager implements DracoTaskListener
{
    private m_rscene:RendererScene = null;
    private m_entityUtils: PBREntityUtils = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_paramEntities:PBRParamEntity[] = [];
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();
    private m_reflectPlaneY: number = -220.0;
    aoMapEnabled: boolean = false;
    constructor() {

    }
    initialize(rscene:RendererScene, entityUtils: PBREntityUtils, mirrorEffector: PBRMirror,uiModule: DefaultPBRUI, envMap: TextureProxy): void {
        if(this.m_rscene != rscene) {
            this.m_rscene = rscene;
            this.m_entityUtils = entityUtils;
            this.m_mirrorEffector = mirrorEffector;
            this.m_uiModule = uiModule;
            this.m_envMap = envMap;
            
            this.m_dracoMeshLoader.initialize(2);
            this.m_dracoMeshLoader.setListener( this );

            this.loadNext();
            this.initPrimitive();
        }
    }
    private m_posList: Vector3D[] = [
        new Vector3D(0,200,0)
        //new Vector3D(0,0,0)
    ];
    private m_modules: string[] = [
        //"static/assets/modules/bunny.rawmd",
        //"static/assets/modules/stainlessSteel.rawmd",
        //"static/assets/modules/loveass.rawmd"
        //"static/assets/modules/car01.rawmd"
        "static/assets/modules/longxiaPincer.rawmd"
    ];
    private m_scale: number = 1.0;
    private m_pos: Vector3D = null;
    private m_scales: number[] = [
        100,
        //1.0,
        //0.5,
        //20.0
    ];
    private loadNext(): void {
        if(this.m_modules.length > 0) {
            this.m_pos = this.m_posList.pop();
            this.m_scale = this.m_scales.pop();
            this.m_dracoMeshLoader.load( this.m_modules.pop() );
        }
    }
    dracoParse(pmodule: any, index: number, total: number): void {
        //console.log("parse progress: "+index+"/"+total);
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("dracoParseFinish, modules: ", modules);

        let mesh: DracoMesh = new DracoMesh();
        mesh.initialize(modules);

        let uvscale: number = Math.random() * 7.0 + 0.6;        
        let material: PBRMaterial = this.m_entityUtils.createMaterial(uvscale,uvscale);
        material.aoMapEnabled = this.aoMapEnabled;
        let scale = this.m_scale;
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial( material );
        entity.setMesh( mesh );
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        this.m_rscene.addEntity(entity);
        let pos: Vector3D = new Vector3D();
        entity.getPosition( pos );
        let pv: Vector3D = entity.getGlobalBounds().min;
        pos.y += (this.m_reflectPlaneY - pv.y) + 70.0;
        entity.setPosition( pos );
        entity.update();

        this.addParamEntity(entity, material);
    }
    private initPrimitive(): void {

        let material: PBRMaterial;

        this.m_paramEntities.push( this.m_mirrorEffector.getPlaneParamEntity() );
        /*
        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);
        //*/
        let sph: Sphere3DEntity;
        let rad: number;
        let radius: number;
        let total: number = 4;
        
        this.m_entityUtils.createTexList();
        this.m_entityUtils.addTexture(this.m_envMap);
        //this.m_entityUtils.addTextureByUrl("static/assets/noise.jpg");
        this.m_entityUtils.addTextureByUrl("static/assets/disp/normal_4_256_COLOR.png");
        this.m_entityUtils.addTextureByUrl("static/assets/disp/normal_4_256_NRM.png");
        if(this.aoMapEnabled) {
            this.m_entityUtils.addTextureByUrl("static/assets/disp/normal_4_256_OCC.png");
        }

        material = this.m_entityUtils.createMaterial(1,1);
        material.aoMapEnabled = this.aoMapEnabled;
        let srcSph = new Sphere3DEntity();
        srcSph.setMaterial( material );
        srcSph.initialize(100.0, 20, 20);
        let scale: number = 1.0;
        let uvscale: number;

        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 150.0 + 650.0;
            uvscale = Math.random() * 7.0 + 0.6;

            material = this.m_entityUtils.createMaterial(uvscale,uvscale);
            material.aoMapEnabled = this.aoMapEnabled;
            scale = 0.8 + Math.random();
            let pr: number = scale * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            sph.copyMeshFrom( srcSph );
            sph.initialize(100.0, 20, 20);
            sph.setScaleXYZ(scale, scale, scale);
            sph.setXYZ(radius * Math.cos(rad), i * 30 + (this.m_reflectPlaneY + 10) + pr + 5, radius * Math.sin(rad));
            this.m_rscene.addEntity(sph);

            this.addParamEntity(sph, material);
        }
    }
    private addParamEntity(entity: DisplayEntity, material: PBRMaterial): void {
        let param: PBRParamEntity = new PBRParamEntity();
        param.entity = entity;
        param.setMaterial( material );
        param.pbrUI = this.m_uiModule;
        param.colorPanel = this.m_uiModule.rgbPanel;
        param.initialize();
        this.m_paramEntities.push(param);
        this.m_entityUtils.createMirrorEntity(param, material);
    }
    run(): void {
        ThreadSystem.Run();
    }
}