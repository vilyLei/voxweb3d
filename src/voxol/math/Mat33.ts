"use strict";

// 列主序3x3矩阵

class Mat33 {

    data: Float32Array = null;
    constructor(fs32Arr9: Float32Array) {
        if (fs32Arr9 == undefined || fs32Arr9.length == undefined || fs32Arr9.length != 9) {
            this.data = new Float32Array(
                [1, 0, 0,
                    0, 1, 0,
                    0, 0, 1]
            );
        } else {
            this.data = new Float32Array(fs32Arr9);
        }
    }

    setTo(tx: number, ty: number, sx: number = 1, sy: number = 1, rotRadians: number = 0): void {

        let c = 1;
        let s = 0;
        if (Math.abs(rotRadians) > 1e-5) {
            c = Math.cos(rotRadians);
            s = Math.sin(rotRadians);
        }

        this.data.set([c * sx, s * sx, 0,
        -s * sy, c * sy, 0,
            tx, ty, 1]);
    }
    setXY(tx: number, ty: number): void {
        this.data[6] = tx;
        this.data[7] = ty;
    }

    ortho(width: number, height: number): void {

        this.data.set([2 / width, 0, 0,
            0, -2 / height, 0,
        -1, 1, 1]);
    }

    // 列主序矩阵的前乘(左乘), 性能更好
    prepend(lhs: Mat33): void {

        let sfs = this.data;
        let lfs = lhs.data;

        for (let i = 0; i < 3; ++i) {
            let rc0 = sfs[i * 3 + 0];
            let rc1 = sfs[i * 3 + 1];
            let rc2 = sfs[i * 3 + 2];
            sfs[i * 3 + 0] = rc0 * lfs[0] + rc1 * lfs[3] + rc2 * lfs[6];
            sfs[i * 3 + 1] = rc0 * lfs[1] + rc1 * lfs[4] + rc2 * lfs[7];
            sfs[i * 3 + 2] = rc0 * lfs[2] + rc1 * lfs[5] + rc2 * lfs[8];
        }
    }
    // 列主序矩阵的后乘(右乘), 性能略弱
    append(rhs: Mat33): void {
        let sfs = this.data;
        let rfs = rhs.data;
        let result = new Float32Array(9);

        for (let i = 0; i < 3; ++i) {
            let rc0 = rfs[i * 3 + 0];
            let rc1 = rfs[i * 3 + 1];
            let rc2 = rfs[i * 3 + 2];

            result[i * 3 + 0] = sfs[0] * rc0 + sfs[3] * rc1 + sfs[6] * rc2;
            result[i * 3 + 1] = sfs[1] * rc0 + sfs[4] * rc1 + sfs[7] * rc2;
            result[i * 3 + 2] = sfs[2] * rc0 + sfs[5] * rc1 + sfs[8] * rc2;
        }
        sfs.set(result);
    }

    mapPoint(point: Vec2Type): Vec2Type {
        let data = this.data;
        let px = data[0] * point.x + data[3] * point.y + data[6];
        let py = data[1] * point.x + data[4] * point.y + data[7];
        return { x: px, y: py };
    }

    mapXY(x: number, y: number) {
        let data = this.data;
        let px = data[0] * x + data[3] * y + data[6];
        let py = data[1] * x + data[4] * y + data[7];
        return { x: px, y: py };
    }

    inverseTo(lhs: Mat33) {
        let data = this.data;
        let det =
            data[0] * (data[4] * data[8] - data[5] * data[7]) -
            data[3] * (data[1] * data[8] - data[2] * data[7]) +
            data[6] * (data[1] * data[5] - data[2] * data[4]);

        if (Math.abs(det) < 1e-8) {
            return false;
        }

        let invDet = 1.0 / det;

        let invData = lhs.data;
        invData[0] = (data[4] * data[8] - data[5] * data[7]) * invDet;
        invData[1] = -(data[1] * data[8] - data[2] * data[7]) * invDet;
        invData[2] = (data[1] * data[5] - data[2] * data[4]) * invDet;

        invData[3] = -(data[3] * data[8] - data[5] * data[6]) * invDet;
        invData[4] = (data[0] * data[8] - data[2] * data[6]) * invDet;
        invData[5] = -(data[0] * data[5] - data[2] * data[3]) * invDet;

        invData[6] = (data[3] * data[7] - data[4] * data[6]) * invDet;
        invData[7] = -(data[0] * data[7] - data[1] * data[6]) * invDet;
        invData[8] = (data[0] * data[4] - data[1] * data[3]) * invDet;

        return true;
    }

    print(): void {
        let data = this.data;
        console.log("{\n");
        for (let i = 0; i < 3; ++i) {
            console.log(
                data[i * 3 + 0].toFixed(5),
                data[i * 3 + 1].toFixed(5),
                data[i * 3 + 2].toFixed(5));
        }
        console.log("}\n");
    }
}