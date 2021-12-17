import Vector3D from "../../../../vox/math/Vector3D";
import AABB from "../../../../vox/geom/AABB";

class TerrainData {

    private m_outPos: Vector3D = new Vector3D();
    rn: number = 8;
    cn: number = 8;
    gridSize: number = 80.0;
    stvs: Uint16Array = null;
    freeSTVS: Uint16Array = null;

    terrainHeight: number = 20.0;

    readonly minPosition: Vector3D = new Vector3D();
    readonly maxPosition: Vector3D = new Vector3D();
    private m_bounds: AABB = new AABB();
    constructor() { }
    initialize(): void {

        let rn: number = this.rn;
        let cn: number = this.cn;
        let gridSize = this.gridSize;

        this.minPosition.setXYZ(cn * gridSize * -0.5, 0.0, rn * gridSize * -0.5);
        this.maxPosition.setXYZ(this.minPosition.x + cn * gridSize, 0.0, this.minPosition.z + rn * gridSize);
        this.m_bounds.min.copyFrom(this.minPosition);
        this.m_bounds.max.copyFrom(this.maxPosition);
        this.m_bounds.updateFast();

        let list: number[] = [];
        for (let i: number = 0; i < this.stvs.length; ++i) {
            if (this.stvs[i] == 0) {
                list.push(Math.floor(i / rn), i % cn);
            }
        }
        this.freeSTVS = new Uint16Array(list);
        //console.log("this.freeSTVS: ",this.freeSTVS);
    }
    getRandomFreeRC(): number[] {
        let len: number = this.freeSTVS.length >> 1;
        let index: number = Math.round(Math.random() * 1024) % len;
        index = index << 1;
        return [this.freeSTVS[index], this.freeSTVS[index + 1]];
    }
    getRandomFreeGridPosition(): Vector3D {
        let rc: number[] = this.getRandomFreeRC();
        return this.getGridPositionByRC(rc[0], rc[1]);
    }
    getRCByPosition(pos: Vector3D): number[] {
        this.m_bounds.getClosePosition(pos, this.m_outPos, 1.0);
        this.m_outPos.subtractBy(this.m_bounds.min);
        let r: number = Math.floor(this.m_outPos.z / this.gridSize);
        let c: number = Math.floor(this.m_outPos.x / this.gridSize);
        return [r, c];
    }
    isObstacleByRC(r: number, c: number): boolean {
        return this.stvs[r * this.rn + c] == 1;
    }
    getGridStatusByRC(r: number, c: number): number {
        return this.stvs[r * this.rn + c];
    }
    getGridPositionByRC(r: number, c: number): Vector3D {
        let pos = this.m_outPos;
        pos.x = this.minPosition.x + c * this.gridSize + 0.5 * this.gridSize;
        pos.y = this.minPosition.y;
        pos.z = this.minPosition.z + r * this.gridSize + 0.5 * this.gridSize;
        return pos;
    }
    getTerrainPositionByRC(r: number, c: number): Vector3D {
        let pos = this.m_outPos;
        pos.x = this.minPosition.x + c * this.gridSize + 0.5 * this.gridSize;
        pos.y = this.minPosition.y + this.terrainHeight;
        pos.z = this.minPosition.z + r * this.gridSize + 0.5 * this.gridSize;
        return pos;
    }
    clone(): TerrainData {
        let ins = new TerrainData();
        ins.rn = this.rn;
        ins.cn = this.cn;
        if (this.stvs != null) {
            ins.stvs = this.stvs.slice(0);
        }
        return ins;
    }

}
export { TerrainData }
