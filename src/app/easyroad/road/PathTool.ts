import Vector3D from "../../../vox/math/Vector3D";

class PathTool {
    
    expandXOZPath(in_posList: Vector3D[], distance: number = 50.0, closed: boolean = false): Vector3D[] {
        //
        closed = closed && Vector3D.Distance(in_posList[in_posList.length - 1],in_posList[0]) < 0.001;

        let out_posList: Vector3D[] = new Array(in_posList.length);
        let tv: Vector3D = new Vector3D();
        let tv1: Vector3D = new Vector3D();
        let rv: Vector3D = new Vector3D();
        let pv: Vector3D = new Vector3D();
        let i: number = 0;
        let len: number = in_posList.length;
        if(closed) {
            len -= 1;
            let pa: Vector3D = null;
            let pb: Vector3D = null;
            let pc: Vector3D = null;
            for(; i < len; ++i) {
                
                pb = in_posList[i];
                if(i < 1) {
                    pa = in_posList[len - 1];
                    pc = in_posList[1];

                } else if(i < (len - 1)) {
                    pa = in_posList[i - 1];
                    pc = in_posList[i + 1];
                }
                else {
                    pa = in_posList[i - 1];
                    pc = in_posList[0];
                }
                tv.subVecsTo(pb,pa);
                //tv.normalize();
                Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);

                tv.subVecsTo(pb, pa);
                tv.y = 0;
                tv.normalize();
                tv1.subVecsTo(pb, pc);
                tv1.y = 0;
                tv1.normalize();
                tv.addBy(tv1);
                tv.normalize();
                if(rv.dot(tv) < 0.0001) {
                    tv.scaleBy(-1);
                }
                rv.copyFrom(tv);

                pv.copyFrom( rv );
                pv.scaleBy( distance );
                pv.addBy(in_posList[i]);
                out_posList[i] = pv.clone();                
            }
            out_posList[len] = out_posList[0].clone();
        }else {
            for(; i < len; ++i) {
    
                if(i < 1) {
                    tv.subVecsTo(in_posList[i+1], in_posList[i]);
                    tv.normalize();
                    Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);
                } else if(i < (len - 1)) {
                    tv.subVecsTo(in_posList[i], in_posList[i - 1]);
                    tv.normalize();
                    tv1.subVecsTo(in_posList[i], in_posList[i + 1]);
                    tv1.normalize();
                    tv.addBy(tv1);
                    tv.normalize();
                    rv.copyFrom(tv);
                }
                else {
                    tv.subVecsTo(in_posList[i], in_posList[i - 1]);
                    tv.normalize();
                    Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);
                }
                pv.copyFrom( rv );
                pv.scaleBy( distance );
                pv.addBy(in_posList[i]);
                out_posList[i] = pv.clone();
            }
        }

        return out_posList;
    }
}

export { PathTool };