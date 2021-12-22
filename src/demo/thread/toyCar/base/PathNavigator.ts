/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import { CurveMotionXZModule } from "../../../../voxmotion/primitive/CurveMotionXZModule";
import { TerrainData } from "../../../../terrain/tile/TerrainData";
import { TerrainPathStatus, TerrainPath } from "../terrain/TerrainPath";
import Vector3D from "../../../../vox/math/Vector3D";
import { EntityStatus } from "./EntityStatus";
import { PathCalculator } from "./PathCalculator";

class PathNavigator{

    private m_delayTime: number = 10;
    private m_stopped: boolean = true;
    private m_terrainData: TerrainData = null;
    private m_target: IEntityTransform = null;
    private m_outPos: Vector3D = new Vector3D();
    
    status: EntityStatus = EntityStatus.Init;
    autoSerachPath: boolean = false;
    readonly curveMotion: CurveMotionXZModule = new CurveMotionXZModule();
    readonly path: TerrainPath = new TerrainPath();
    constructor() {
    }
    setTarget(target: IEntityTransform): void {
        this.m_target = target;
        this.curveMotion.setTarget(target);
    }
    initialize(terrainData: TerrainData): void {
        this.m_terrainData = terrainData;
        this.m_delayTime = Math.round(Math.random() * 100) + 30;
    }
    searchedPath(vs: Uint16Array): void {

        //console.log("searchedPath,vs: ", vs);

        let posList: Vector3D[] = PathCalculator.GetPathPosList(vs, this.path, this.m_terrainData);

        // console.log("posList: ", posList);
        // if (this.m_pathCurve != null) {
        //     this.m_pathCurve.initializePolygon(posList);
        //     this.m_pathCurve.reinitializeMesh();
        //     this.m_pathCurve.updateMeshToGpu();
        //     this.m_pathCurve.updateBounds();
        // }
        this.m_target.getPosition( this.m_outPos );
        let motion = this.curveMotion.motion;
        //motion.setTarget(this.transform);
        motion.setVelocityFactor(0.04, 0.04);
        motion.setCurrentPosition( this.m_outPos );
        this.curveMotion.setPathPosList(posList);

        this.path.searchedPath();
        this.path.movingPath();

        this.m_delayTime = Math.round(Math.random() * 100) + 30;
        this.status = EntityStatus.Moving;
    }
    isMoving(): boolean {
        return !this.m_stopped;
    }
    isStopped(): boolean {
        return this.m_stopped;
    }
    run(): void {
        if (this.path.isMoving()) {
            this.m_stopped = this.curveMotion.isStopped();
            if (this.m_stopped) {
                this.path.stopPath();
                this.status = EntityStatus.Stop;
            }
            else {
                this.curveMotion.run();
            }
        }
        else {
            this.m_stopped = true;
            if (this.m_delayTime > 0) {
                this.m_delayTime--;
                if (this.m_delayTime == 0) {
                    this.findRandomPath();
                }
            }
        }
    }
    findRandomPath(): void {
        if (this.autoSerachPath) {
            this.m_target.getPosition( this.m_outPos );
            let beginRC: number[] = this.m_terrainData.getRCByPosition( this.m_outPos );
            let endRC: number[] = this.m_terrainData.getRandomFreeRC();

            this.path.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
            if (beginRC[0] != endRC[0] || beginRC[1] != endRC[1]) {
                this.path.searchPath();
            }
            else {
                this.stopAndWait();
            }
        }
    }
    
    stopAndWait(): void {
        this.m_delayTime = Math.round(Math.random() * 100) + 30;
        this.path.stopPath();
    }
    
    searchingPath(): void {
        this.path.searchingPath();
    }
    stopPath(): void {
        this.path.stopPath();
    }
    setBeginRC(r: number, c: number): void {
        this.path.setBeginRC(r, c);
    }
    setEndRC(r: number, c: number): void {
        this.path.setEndRC(r, c);
    }
    setSearchPathParam(r0: number, c0: number, r1: number, c1: number): void {
        this.path.setSearchPathParam(r0, c0, r1, c1);
    }
    isReadySearchPath(): boolean {        
        return this.path.isReadySearchPath();
    }
}
export { PathNavigator };