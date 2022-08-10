
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import RendererScene from "../../../vox/scene/RendererScene";
import RendererSubScene from "../../../vox/scene/RendererSubScene";

import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import { IMeshBase } from "../../../vox/mesh/IMeshBase";
import MeshBase from "../../../vox/mesh/MeshBase";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import Cylinder3DEntity from "../../../vox/entity/Cylinder3DEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import ObjData3DEntity from "../../../vox/entity/ObjData3DEntity";
import Billboard3DEntity from "../../../vox/entity/Billboard3DEntity";
import DashedLine3DEntity from "../../../vox/entity/DashedLine3DEntity";
import CameraBase from "../../../vox/view/CameraBase";
import TextureProxy from "../../../vox/texture/TextureProxy";

import * as ParalLightDataT from "../light/ParalLightData";
import * as ParalMap2MaterialT from "../mateiral/ParalMap2Material";
//import * as WetWoodMaterialT from "../mateiral/WetWoodMaterial";
import * as DispEvtEntityT from "./DispEvtEntity";
import * as LightEvtEntityT from "./LightEvtEntity";
import * as AxisDragObjectT from "./AxisDragObject";
import * as TexManagerT from "./TexManager";
import * as MaterialParamT from "./MaterialParam";
import * as MaterialManagerT from "./MaterialManager";
import * as MaterialUISceneT from "./MaterialUIScene";

//import DashedLine3DEntity = DashedLine3DEntityT.vox.entity.DashedLine3DEntity;
import ParalLightData = ParalLightDataT.voxvat.demo.light.ParalLightData;
import ParalMap2Material = ParalMap2MaterialT.voxvat.demo.material.ParalMap2Material;
import DispEvtEntity = DispEvtEntityT.voxvat.demo.scene.DispEvtEntity;
import LightEvtEntity = LightEvtEntityT.voxvat.demo.scene.LightEvtEntity;
import LightBoundsEntity = LightEvtEntityT.voxvat.demo.scene.LightBoundsEntity;
import AxisDragObject = AxisDragObjectT.voxvat.demo.scene.AxisDragObject;
import TexManager = TexManagerT.voxvat.demo.scene.TexManager;
import MaterialParam = MaterialParamT.voxvat.demo.scene.MaterialParam;
import MaterialManager = MaterialManagerT.voxvat.demo.scene.MaterialManager;
import MaterialUIScene = MaterialUISceneT.voxvat.demo.scene.MaterialUIScene;

export namespace voxvat {
    export namespace demo {
        export namespace scene {
            export class ParalMap2Scene {
                constructor() {
                }
                private m_rsc: RendererScene = null;
                private m_ruisc: RendererSubScene = null;
                private m_dispEvtEntities: DispEvtEntity[] = [];

                private m_axisDragObj: AxisDragObject = null;
                private m_materialParams: MaterialParam[] = [];
                private m_materialUISC: MaterialUIScene = null;

                getAxisDragObj(): AxisDragObject {
                    return this.m_axisDragObj;
                }
                setAxisDragObj(ctrlObj: AxisDragObject): void {
                    this.m_axisDragObj = ctrlObj;
                }
                setMaterialUISC(uisc: MaterialUIScene): void {
                    this.m_materialUISC = uisc;
                }
                getMaterialUISC(): MaterialUIScene {
                    return this.m_materialUISC;
                }
                initialize(rscene: RendererScene, uiscene: RendererSubScene): void {
                    this.m_rsc = rscene;
                    this.m_ruisc = uiscene;
                    let i: number = 0;
                    let j: number = 0;
                    let texList: TextureProxy[] = [
                        TexManager.CreateTexByUrl("static/assets/yanj.jpg"),
                        TexManager.CreateTexByUrl("static/assets/disp/yanj_OCC.png"),
                        TexManager.CreateTexByUrl("static/assets/disp/yanj_NRM.png"),
                        TexManager.CreateTexByUrl("static/assets/moss_04.jpg"),
                        TexManager.CreateTexByUrl("static/assets/image_003_1.jpg")
                    ];

                    let billTex0: TextureProxy = TexManager.CreateTexByUrl("static/assets/flare_core_03.jpg");
                    let startX: number = -700.0 - 350;
                    let startZ: number = -700.0 - 350;
                    let pv: Vector3D = new Vector3D();
                    let total: number = 0;
                    let entityTotal: number = 4;
                    let axis: Axis3DEntity = null;
                    let lightET: LightEvtEntity = null;
                    let boundsDisp: LightBoundsEntity = null;
                    let minV: Vector3D = new Vector3D(-30.0, -30.0, -30.0);
                    let maxV: Vector3D = new Vector3D(30.0, 30.0, 30.0);
                    let linear: number;
                    let quadratic: number;
                    let radius: number;
                    let pcolor: Color4 = new Color4();
                    let lights: LightBoundsEntity[] = [];

                    axis = new Axis3DEntity();
                    axis.initializeCross(500.0);
                    this.m_rsc.addEntity(axis);

                    for (i = 0; i < entityTotal; ++i) {
                        for (j = 0; j < entityTotal; ++j) {
                            pv.setXYZ(startX + j * 700.0, 30 + Math.round(Math.random() * 900.0), Math.round(startZ + i * 700.0));
                            axis = new Axis3DEntity();
                            axis.initializeCross(60.0);
                            axis.setXYZ(pv.x, pv.y, pv.z);
                            this.m_rsc.addEntity(axis);
                            boundsDisp = new LightBoundsEntity();
                            boundsDisp.index = total;
                            boundsDisp.disp = axis;
                            boundsDisp.disp1 = axis;
                            boundsDisp.initialize(minV, maxV);
                            boundsDisp.setPosition(pv);
                            this.m_rsc.addEntity(boundsDisp);
                            lights.push(boundsDisp);
                            lightET = new LightEvtEntity();
                            lightET.initialize(boundsDisp);
                            lightET.dragCtrlObj = this.m_axisDragObj;

                            lightET.addEventListener(MouseEvent.MOUSE_DOWN, this, this.lightMouseDown);
                            linear = 0.0001;
                            quadratic = 0.000003;
                            radius = ParalLightData.CalcLightRadius(linear, quadratic);
                            ParalLightData.SetRadiusAt(radius, total);
                            ParalLightData.SetLightPosAt(pv.x, pv.y, pv.z, total);
                            ParalLightData.SetLightColorAt(Math.random() * 1.0 + 0.2, Math.random() * 1.0 + 0.2, Math.random() * 1.0 + 0.2, total);

                            ParalLightData.SetLightParamAt(0.0001, 0.000003, 0.9 + Math.random() * 0.5, total);

                            total++;
                        }
                    }
                    radius *= 0.2;
                    let billboard: Billboard3DEntity;
                    let srcBillboard: Billboard3DEntity = new Billboard3DEntity();
                    srcBillboard.initialize(radius, radius, [billTex0]);
                    for (i = 0; i < 16; ++i)
                    //for(i = 0; i < 0; ++i)
                    {
                        billboard = new Billboard3DEntity();
                        billboard.copyMeshFrom(srcBillboard);
                        billboard.setRenderStateByName("ADD02");
                        billboard.initialize(230.0, 230.0, [billTex0]);
                        ParalLightData.GetLightColorAt(pcolor, i);
                        billboard.setRGB3f(pcolor.r * 0.5, pcolor.g * 0.5, pcolor.b * 0.5);
                        ParalLightData.GetLightPosAt(pv, i);
                        billboard.setPosition(pv);
                        this.m_rsc.addEntity(billboard, 3);
                        lights[i].disp1 = billboard;
                    }

                    // It is an invalid function.
                    ParalLightData.SetLightFactor(0.5, 0.6, 16.0, 0.0);
                    // build light pos/color/params data.
                    ParalLightData.Update();
                    let plMaterial: MaterialBase;
                    entityTotal -= 1;
                    startX = -700.0;
                    startZ = -700.0;
                    total = 0;
                    let size: number;
                    let ptot: number = entityTotal;
                    let cylinder: Cylinder3DEntity;
                    let box: Box3DEntity;
                    let sphere: Sphere3DEntity;
                    let objDisp: ObjData3DEntity;
                    let mesh: IMeshBase = null;
                    // for test
                    //ptot = 0;
                    for (i = 0; i < ptot; ++i) {
                        for (j = 0; j < ptot; ++j) {
                            mesh = null;
                            if (Math.random() > 0.5) {
                                if (Math.random() > 0.5) {
                                    if (cylinder != null) { mesh = cylinder.getMesh(); }
                                    cylinder = new Cylinder3DEntity();
                                    if (mesh != null) { cylinder.setMesh(mesh); }
                                    cylinder.vScale = 3.0;
                                    plMaterial = this.createMaterial2();
                                    cylinder.setMaterial(plMaterial);
                                    cylinder.initialize(120 + Math.random() * 50, 60 * Math.random() + 260, 20, texList, 1, -0.5);
                                    cylinder.setXYZ(startX + j * 700.0, 300, startZ + i * 700.0);
                                    this.m_rsc.addEntity(cylinder);
                                    this.m_materialParams.push(new MaterialParam());
                                    this.createDispEvtEntity(cylinder, total++);

                                }
                                else {
                                    size = 200.0;
                                    if (box != null) { mesh = box.getMesh(); }
                                    box = new Box3DEntity();
                                    if (mesh != null) { box.setMesh(mesh); }

                                    plMaterial = this.createMaterial2();
                                    box.setMaterial(plMaterial);
                                    box.initialize(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), texList);
                                    box.setXYZ(startX + j * 700.0, 300, startZ + i * 700.0);
                                    this.m_rsc.addEntity(box);
                                    this.m_materialParams.push(new MaterialParam());
                                    this.createDispEvtEntity(box, total++);
                                }
                            }
                            else {
                                if (Math.random() > 0.5) {
                                    if (objDisp != null) { mesh = objDisp.getMesh(); }
                                    objDisp = this.createTorus(mesh as MeshBase, startX + j * 700.0, 300.0, startZ + i * 700.0, texList, total++);
                                }
                                else {
                                    if (sphere != null) { mesh = sphere.getMesh(); }
                                    sphere = new Sphere3DEntity();
                                    if (mesh != null) { sphere.setMesh(mesh); }

                                    plMaterial = this.createMaterial2();;
                                    sphere.setMaterial(plMaterial);
                                    sphere.initialize(300, 20, 20, texList);
                                    sphere.setXYZ(startX + j * 700.0, 300, startZ + i * 700.0);
                                    this.m_rsc.addEntity(sphere);
                                    this.m_materialParams.push(new MaterialParam());
                                    this.createDispEvtEntity(sphere, total++);
                                }
                            }
                        }
                    }
                    /*
                    // for test begin

                    let camera0:CameraBase = new CameraBase();
                    camera0.lookAtRH(new Vector3D(-900.0,900.0,900.0), new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
                    camera0.perspectiveRH(MathConst.DegreeToRadian(45.0),600.0/500.0,150.1,1500.0);
                    camera0.update();
                    let pvs:Vector3D[] = camera0.getWordFrustumVtxArr();
                    let fruLine:DashedLine3DEntity = new DashedLine3DEntity();
                    fruLine.initializeDashedLine([pvs[0],pvs[1],pvs[1],pvs[2],pvs[2],pvs[3],pvs[3],pvs[0]]);
                    fruLine.setRGB3f(1.0,0.0,1.0);
                    this.m_rsc.addEntity(fruLine);
                    fruLine = new DashedLine3DEntity();
                    fruLine.initializeDashedLine([pvs[4],pvs[5],pvs[5],pvs[6],pvs[6],pvs[7],pvs[7],pvs[4]]);
                    fruLine.setRGB3f(0.0,0.5,1.0);
                    this.m_rsc.addEntity(fruLine);                
                    fruLine = new DashedLine3DEntity();
                    fruLine.initializeDashedLine([pvs[0],pvs[4],pvs[1],pvs[5],pvs[2],pvs[6],pvs[3],pvs[7]]);
                    fruLine.setRGB3f(0.0,0.9,0.0);
                    this.m_rsc.addEntity(fruLine);
                    let pradius:number = 200.0;
                    sphere = new Sphere3DEntity();
                    plMaterial = this.createMaterial2();;
                    sphere.setMaterial( plMaterial );
                    sphere.initialize(pradius,30,30,texList);
                    sphere.setXYZ(0.0,300,0.0);
                    this.m_rsc.addEntity(sphere);
                    this.m_materialParams.push(new MaterialParam());
                    this.createDispEvtEntity(sphere, total++,camera0,pradius);
                    
                    // for test end
                    //*/

                    plMaterial = this.createMaterial2();
                    let scale: number = 2.0;
                    let plane: Plane3DEntity = new Plane3DEntity();
                    plane.setMaterial(plMaterial);
                    plane.initializeXOZ(-800, -800, 1600, 1600, texList);
                    plane.setXYZ(0.0, -300.0, 0.0);
                    plane.setScaleXYZ(scale, scale, scale);
                    this.m_rsc.addEntity(plane);
                }
                private createMaterial2(): MaterialBase {
                    let m: ParalMap2Material = new ParalMap2Material();
                    m.initData();
                    return m;
                }
                private createDispEvtEntity(disp: DisplayEntity, pindex: number, camera: CameraBase = null, radius: number = 0.0): void {
                    let evtEntity: DispEvtEntity = new DispEvtEntity();
                    evtEntity.radius = radius;
                    evtEntity.camera = camera;
                    evtEntity.index = pindex;
                    evtEntity.initialize(disp);
                    evtEntity.dragCtrlObj = this.m_axisDragObj;
                    this.m_dispEvtEntities.push(evtEntity);

                    evtEntity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.onSelectDispEntity);
                }
                private createTorus(mesh: MeshBase, px: number, py: number, pz: number, texList: TextureProxy[], pindex: number): ObjData3DEntity {
                    let objUrl: string = "static/assets/objs/torus01.obj";

                    let plMaterial: MaterialBase = this.createMaterial2();
                    let objDisp: ObjData3DEntity = new ObjData3DEntity();
                    objDisp.setMesh(mesh);
                    objDisp.setMaterial(plMaterial);
                    objDisp.moduleScale = 6.0 + Math.random() * 2.0;
                    objDisp.initializeByObjDataUrl(objUrl, texList);
                    let param: MaterialParam = new MaterialParam();
                    param.uscale = 2.0;
                    param.vscale = 6.0;
                    this.m_materialParams.push(param);
                    let m: any = plMaterial;
                    m.setUVScale(param.uscale, param.vscale);
                    objDisp.setXYZ(px, py, pz);
                    this.m_rsc.addEntity(objDisp);

                    this.createDispEvtEntity(objDisp, pindex);
                    return objDisp;
                }
                private lightMouseDown(evt: any): void {
                    //console.log("ParalMap2Scene::lightMouseDown(), evt.target: "+evt.target);
                    MaterialManager.SetDispTarget(null);
                    if (this.m_materialUISC != null) {
                        this.m_materialUISC.hideUI();
                    }
                }
                private onSelectDispEntity(evt: any): void {
                    //console.log("ParalMap2Scene::onSelectDispEntity(), evt.target: "+evt.target);
                    MaterialManager.SetDispTarget(evt.target.getDisp());
                    MaterialManager.SetMaterialParam(this.m_materialParams[evt.target.index]);
                    if (this.m_materialUISC != null) {
                        this.m_materialUISC.showUI();
                    }
                }
                runCtrl(): void {
                }
                run(): void {
                    let i: number = 0;
                    let list: DispEvtEntity[] = this.m_dispEvtEntities;
                    let len: Number = list.length;
                    for (; i < len; ++i) {
                        list[i].run();
                    }
                }

                runEnd(): void {
                }
            }
        }
    }
}