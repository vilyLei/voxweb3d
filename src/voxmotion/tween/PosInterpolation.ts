import Vector3D from "../../vox/math/Vector3D";
class PosInterpolation {

    private m_tempva: Vector3D = new Vector3D();
    //position: Vector3D = new Vector3D();
    minDis: number = 50.0;
    factor: number = 0.3;
    interpolate(new_pos: Vector3D, currPos: Vector3D): void {
        
        this.m_tempva.subVecsTo(new_pos, currPos);
        let minDis: number = this.minDis;
        if (this.m_tempva.getLengthSquared() > (minDis * minDis)) {
            minDis = this.m_tempva.getLength() - minDis;
            this.m_tempva.normalize();
            this.m_tempva.scaleBy(minDis * this.factor);
            currPos.addBy(this.m_tempva);
        }
    }
}

export { PosInterpolation };