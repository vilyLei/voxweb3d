/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import Matrix4 from "../../../../vox/math/Matrix4";
import PureEntity from "../../../../vox/entity/PureEntity";

import TextureProxy from "../../../../vox/texture/TextureProxy";
import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import { AssetPackage } from "./AssetPackage";
import RendererScene from "../../../../vox/scene/RendererScene";
import { IToyEntity } from "./IToyEntity";
import { TerrainPathStatus, TerrainPath } from "../terrain/TerrainPath";
import { TerrainData } from "../terrain/TerrainData";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";

import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import { CurveMotionAction } from "../../../../voxmotion/curve/CurveMotionAction";
import { EntityStatus } from "./EntityStatus";

class CarEntity implements IToyEntity, IEntityTransform {

    private static s_srcBox0: Box3DEntity = null;
    private static s_srcBox1: Box3DEntity = null;
    
    private m_moveAction: CurveMotionAction = new CurveMotionAction();
    private m_pathCurve: Line3DEntity = null;

    private m_entityIndex: number = -1;
    private m_fs32Length: number = 15;
    private m_fs32Data: Float32Array = null;
    private m_entityList: PureEntity[] = [];
    private m_transMat4List: Matrix4[] = [];
    private m_position: Vector3D = new Vector3D();
    private m_outPos: Vector3D = new Vector3D();
    private m_scene: RendererScene = null;
    private m_pathPosList: Vector3D[] = [];
    private m_delayTime: number = 10;

    status: EntityStatus = EntityStatus.Init;
    asset: AssetPackage = null;
    terrainData: TerrainData = null;
    readonly path: TerrainPath = new TerrainPath();
    constructor() {
    }

    getEneityIndex(): number {
        return this.m_entityIndex;
    }
    setFS32Data(srcFS32: Float32Array, index: number): void {
        this.m_entityIndex = index;
        this.m_fs32Data = srcFS32.subarray(index * this.m_fs32Length, (index + 1) * this.m_fs32Length);
    }
    build(sc: RendererScene): void {
        if (this.m_entityIndex >= 0) {
            this.m_scene = sc;

            if (this.m_pathCurve == null) {
                this.m_pathCurve = new Line3DEntity();
                this.m_pathCurve.initialize(new Vector3D(), new Vector3D(100.0));
                this.m_pathCurve.setXYZ(0.0, 20.0, 0.0);
                this.m_scene.addEntity(this.m_pathCurve);
            }

            let tex0: TextureProxy = this.asset.textures[0];

            if (CarEntity.s_srcBox0 == null) {
                CarEntity.s_srcBox0 = new Box3DEntity();
                CarEntity.s_srcBox0.initialize(new Vector3D(-100.0, -50.0, -100.0), new Vector3D(100.0, 50.0, 100.0), [tex0]);
            }
            if (CarEntity.s_srcBox1 == null) {
                CarEntity.s_srcBox1 = new Box3DEntity();
                CarEntity.s_srcBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            }
            let srcBox0 = CarEntity.s_srcBox0;
            let srcBox1 = CarEntity.s_srcBox1;

            let materialBox0: Box3DEntity = new Box3DEntity();
            materialBox0.copyMeshFrom(srcBox0);
            materialBox0.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            let material0: any = materialBox0.getMaterial();
            material0.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

            let tex1: TextureProxy = this.asset.textures[1];
            let materialBox1: Box3DEntity = new Box3DEntity();
            materialBox1.copyMeshFrom(srcBox0);
            materialBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            let material1: any = materialBox1.getMaterial();
            material1.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

            let box: PureEntity;
            box = new PureEntity();
            box.copyMeshFrom(srcBox0);
            box.copyMaterialFrom(materialBox0);
            sc.addEntity(box);
            this.m_entityList.push(box);
            this.m_transMat4List.push(box.getMatrix());

            for (let j: number = 1; j < 5; j++) {
                box = new PureEntity();
                box.copyMeshFrom(srcBox1);
                box.copyMaterialFrom(materialBox1);
                sc.addEntity(box);
                this.m_transMat4List.push(box.getMatrix());
            }
            // for test
            //this.setPosXYZ( 200, 50, 200 );
            this.setXYZ(200, 50, 200);
            this.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
            // whole body scale, param 1, param 2
            this.setParam(0.2, 0.5, 0.5);
            // 轮子的位置偏移值
            this.setWheelOffsetXYZ(80.0, -30.0, 100.0);
            // wheel init rotation, wheel rotation spd, wheel body scale;
            this.setWheelRotParam(30.0, -2.0, 0.3);
        }
    }
    getPosition(): Vector3D {
        this.m_outPos.copyFrom(this.m_position);
        return this.m_outPos;
    }
    setPosition(pos: Vector3D): void {
        this.m_position.copyFrom(pos);
        //console.log("this.m_entityIndex >= 0: ",this.m_entityIndex >= 0, pos);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = pos.x;
            this.m_fs32Data[1] = pos.y;
            this.m_fs32Data[2] = pos.z;
        }
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_position.setXYZ(px, py, pz);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = px;
            this.m_fs32Data[1] = py;
            this.m_fs32Data[2] = pz;
        }
    }
    setRotationXYZ(prx: number, pry: number, prz: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[3] = prx;
            this.m_fs32Data[4] = pry;
            this.m_fs32Data[5] = prz;
        }
    }
    setScale(bodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[6] = bodyScale;
        }
    }
    /**
     * 
     * @param bodyScale whole body scale
     * @param param1 
     * @param param2 
     */
    setParam(bodyScale: number, param1: number, param2: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[6] = bodyScale;
            this.m_fs32Data[7] = param1;
            this.m_fs32Data[8] = param2;
        }
    }
    setWheelOffsetXYZ(px: number, py: number, pz: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[9] = px;
            this.m_fs32Data[10] = py;
            this.m_fs32Data[11] = pz;
        }
    }
    // wheel init rotation, spd, wheel body scale;
    setWheelRotParam(pr: number, wheelRotSpd: number, bodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[12] = pr;
            this.m_fs32Data[13] = wheelRotSpd;
            this.m_fs32Data[14] = bodyScale;
        }
    }
    setWheelRotSpeed(wheelRotSpd: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[13] = wheelRotSpd;
            console.log("wheelRotSpd: ",wheelRotSpd);
        }
    }
    destroy(): void {
    }

    isReadySearchPath(): boolean {
        return this.path.isReadySearchPath();
    }
    searchedPath(vs: Uint16Array): void {

        //console.log("searchedPath,vs: ", vs);
        
        let path = this.path;
        let terrData = this.terrainData;
        
        let posList: Vector3D[] = new Array(vs.length >> 1);
        let k: number = 0;
        posList[k++] = terrData.getGridPositionByRC(path.r0, path.c0).clone();
        for (let i: number = vs.length - 1; i > 0;) {
            // vs[i-2]: r, vs[i-1]: c
            let pv = terrData.getGridPositionByRC(vs[i - 1], vs[i]);
            posList[k++] = pv.clone();
            i -= 2;
        }
        // console.log("posList: ", posList);
        this.m_pathCurve.initializePolygon(posList);
        this.m_pathCurve.reinitializeMesh();
        this.m_pathCurve.updateMeshToGpu();
        this.m_pathCurve.updateBounds();
        
        this.m_moveAction.posInterp.minDis = 5.0;
        this.m_moveAction.degreeTween.factor = 0.1;
        this.m_moveAction.degreeTween.speed = 0.1;
        this.m_moveAction.motionSpeed = 2.0;
        this.m_moveAction.targetPosOffset.setXYZ(0.0, 20.0, 0.0);
        this.m_moveAction.bindTarget(this);
        this.m_moveAction.setPathPosList(posList, false);
        this.path.searchedPath();
        this.path.movingPath();

        this.m_delayTime = Math.round(Math.random() * 100) + 30;
        this.status = EntityStatus.Moving;
    }
    updateTrans(fs32: Float32Array): void {
        switch(this.status) {
            case EntityStatus.Init:
                this.status = EntityStatus.Stop;
                break;
            default:
                break;
        }
        let index = this.m_entityIndex * 5;
        for (let i: number = 0; i < 5; ++i) {
            this.m_transMat4List[i].copyFromF32Arr(fs32, index * 16);
            ++index;
        }
    }
    run(): void {
        if(this.path.isMoving()) {
            if(this.m_moveAction.isStopped()) {
                this.path.stopPath();
                this.status = EntityStatus.Stop;
            }
            this.m_moveAction.run();
        }
        else {
            if(this.m_delayTime > 0) {
                this.m_delayTime --;
                if(this.m_delayTime == 0) {
                    let beginRC: number[] = this.terrainData.getRCByPosition(this.m_position);
                    let endRC: number[] = this.terrainData.getRandomFreeRC();
                    
                    // endRC[0] = beginRC[0];// = endRC[0] = 0;
                    // endRC[1] = beginRC[1];// = endRC[1] = 0;
                    this.path.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
                    if(beginRC[0] != endRC[0] || beginRC[1] != endRC[1]) {
                        this.path.searchPath();
                        //this.path.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
                        console.log("search new path, beginRC: ",beginRC, ", endRC: ",endRC);
                    }
                    else {
                        console.log("始末位置相同 re-waiting, beginRC: ",beginRC, ", endRC: ",endRC);
                        this.stopAndWait()
                    }
                }
            }
        }
    }
    stopAndWait(): void {
        this.m_delayTime = Math.round(Math.random() * 30) + 10;
        this.path.stopPath();
    }

    setScaleXYZ(sx: number, sy: number, sz: number): void {
        
    }
    getRotationXYZ(pv: Vector3D): void {
        
    }
    getScaleXYZ(pv: Vector3D): void {
        
    }
    localToGlobal(pv: Vector3D): void {
        
    }
    globalToLocal(pv: Vector3D): void {
        
    }
    update(): void {
        
    }
}
export { CarEntity };