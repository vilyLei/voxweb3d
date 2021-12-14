import Vector3D from "../../../../vox/math/Vector3D";

class TerrainData {

    private m_outPos: Vector3D = new Vector3D();
    rn: number = 8;
    cn: number = 8;
    gridSize: number = 80.0;
    stvs: Uint16Array = null;
    freeSTVS: Uint16Array = null;
    
    readonly beginPosition: Vector3D = new Vector3D();

    constructor() { }
    initialize(): void {

        let rn: number = this.rn;
        let cn: number = this.cn;
        let gridSize = this.gridSize;
        this.beginPosition.setXYZ(cn * gridSize * -0.5 + 0.5 * gridSize, 0.0, rn * gridSize * -0.5 + 0.5 * gridSize);
        let list: number[] = [];
        for(let i: number = 0; i < this.stvs.length; ++i) {
            if(this.stvs[i] == 0) {
                list.push(Math.floor(i/rn), i%cn);
            }
        }
        this.freeSTVS = new Uint16Array(list);
        console.log("this.freeSTVS: ",this.freeSTVS);
    }
    isObstacleByRC(r: number, c: number): boolean {
        return this.stvs[r * this.rn + c] == 1;
    }
    getGridStatusByRC(r: number, c: number): number {
        return this.stvs[r * this.rn + c];
    }
    getGridPositionByRC(r: number, c: number): Vector3D {
        let pos = this.m_outPos;
        pos.x = this.beginPosition.x + c * this.gridSize;
        pos.y = this.beginPosition.y;
        pos.z = this.beginPosition.z + r * this.gridSize;
        return pos;
    }
    clone(): TerrainData {
        let ins = new TerrainData();
        ins.rn = this.rn;
        ins.cn = this.cn;
        if(this.stvs != null) {
            ins.stvs = this.stvs.slice(0);
        }
        return ins;
    }

}
export { TerrainData }
