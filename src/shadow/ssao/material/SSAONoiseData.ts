/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Matrix4 from "../../../vox/math/Matrix4";
import MathConst from "../../../vox/math/MathConst";
import Vector3D from "../../../vox/math/Vector3D";
import { ITextureBlock } from "../../../vox/texture/ITextureBlock";
import TextureConst from "../../../vox/texture/TextureConst";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

export default class SSAONoiseData {
    private m_texBlock: ITextureBlock = null;

    grad3: number[][] = [[1, 1, 0], [- 1, 1, 0], [1, - 1, 0], [- 1, - 1, 0],
    [1, 0, 1], [- 1, 0, 1], [1, 0, - 1], [- 1, 0, - 1],
    [0, 1, 1], [0, - 1, 1], [0, 1, - 1], [0, - 1, - 1]];

    grad4: number[][] = [[0, 1, 1, 1], [0, 1, 1, - 1], [0, 1, - 1, 1], [0, 1, - 1, - 1],
    [0, - 1, 1, 1], [0, - 1, 1, - 1], [0, - 1, - 1, 1], [0, - 1, - 1, - 1],
    [1, 0, 1, 1], [1, 0, 1, - 1], [1, 0, - 1, 1], [1, 0, - 1, - 1],
    [- 1, 0, 1, 1], [- 1, 0, 1, - 1], [- 1, 0, - 1, 1], [- 1, 0, - 1, - 1],
    [1, 1, 0, 1], [1, 1, 0, - 1], [1, - 1, 0, 1], [1, - 1, 0, - 1],
    [- 1, 1, 0, 1], [- 1, 1, 0, - 1], [- 1, - 1, 0, 1], [- 1, - 1, 0, - 1],
    [1, 1, 1, 0], [1, 1, - 1, 0], [1, - 1, 1, 0], [1, - 1, - 1, 0],
    [- 1, 1, 1, 0], [- 1, 1, - 1, 0], [- 1, - 1, 1, 0], [- 1, - 1, - 1, 0]];
    private m_p: number[] = new Array(256);
    private m_perm: number[] = new Array(512);
    constructor() {

        for (var i = 0; i < 256; i++) {

            this.m_p[i] = Math.floor(Math.random() * 256);

        }
        for (var i = 0; i < 512; i++) {

            this.m_perm[i] = this.m_p[i & 255];

        }
    }
    dot3(g: number[], x: number, y: number, z: number): number {

        return g[0] * x + g[1] * y + g[2] * z;

    };
    noise3d(xin: number, yin: number, zin: number): number {

        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var F3 = 1.0 / 3.0;
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var G3 = 1.0 / 6.0; // Very nice and simple unskew factor, too
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {

            if (y0 >= z0) {

                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;

                // X Y Z order

            } else if (x0 >= z0) {

                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;

                // X Z Y order

            } else {

                i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;

            } // Z X Y order

        } else { // x0<y0

            if (y0 < z0) {

                i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;

                // Z Y X order

            } else if (x0 < z0) {

                i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;

                // Y Z X order

            } else {

                i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;

            } // Y X Z order

        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        var gi0 = this.m_perm[ii + this.m_perm[jj + this.m_perm[kk]]] % 12;
        var gi1 = this.m_perm[ii + i1 + this.m_perm[jj + j1 + this.m_perm[kk + k1]]] % 12;
        var gi2 = this.m_perm[ii + i2 + this.m_perm[jj + j2 + this.m_perm[kk + k2]]] % 12;
        var gi3 = this.m_perm[ii + 1 + this.m_perm[jj + 1 + this.m_perm[kk + 1]]] % 12;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {

            t0 *= t0;
            n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0);

        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {

            t1 *= t1;
            n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1);

        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {

            t2 *= t2;
            n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2);

        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {

            t3 *= t3;
            n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3);

        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);

    };
    initialize(texBlock: ITextureBlock): void {
        this.m_texBlock = texBlock;
    }
    private lerp(a: number, b: number, f: number): number {
        return a + f * (b - a);
    }
    calcSampleKernel(total: number, type: number = 0): Float32Array {
        //std::uniform_real_distribution<GLfloat> randomFloats(0.0, 1.0); // generates random floats between 0.0 and 1.0
        //std::default_random_engine generator;
        //std::vector<glm::vec3> ssaoKernel;
        let scale: number = 0.0;
        let dataArr: Float32Array = null;
        ///*
        if (type == 0) {
            dataArr = new Float32Array([
                -0.03235803784003493, 0.001585823784285346, 0.038566134356142645, -0.00046060874862669345,
                -0.002772005506981998, 0.0051313334622426175, 0.04856469052504219, -0.011930993270554417,
                0.0597608894338323, -0.008310038289413084, 0.004391223041509458, 0.010047828697894818,
                -0.06196600274858307, 0.00422680168901238, 0.15932505284836787, 0.012538884438134813,
                -0.03518876541075045, 0.04218624828304494, -0.02943238819904252, 0.0997011337685477,
                0.1288117554569383, 0.15237151606605176, 0.1932517383538349, 0.19862488996572203,
                0.041456847350090635, -0.035743268292415746, 0.08050385505625032, 0.36640333840317946,
                -0.5116343777072901, 0.4944038858156491
            ]);
        }
        //*/
        if (dataArr != null && dataArr.length > 0) {
            console.log("dataArr.length: " + dataArr.length);
            return dataArr;
        }
        else {
            dataArr = new Float32Array(total * 3);
        }
        let v3 = new Vector3D();
        let k: number = 0;
        for (let i = 0; i < total; ++i) {
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, 0.9 * (1.0 - scale * scale) + 0.2);
            v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 0.5 + 0.5 * (0.9 - 0.9 * scale * scale + 0.01));
            v3.normalize();
            scale = i / total;
            scale = this.lerp(0.1, 1.0, scale * scale);
            v3.scaleBy(scale);
            dataArr[k] = v3.x;
            dataArr[k + 1] = v3.y;
            dataArr[k + 2] = v3.z;
            k += 3;
        }
        return dataArr;
    }
    calcSampleKernel2(total: number): Float32Array {
        //std::uniform_real_distribution<GLfloat> randomFloats(0.0, 1.0); // generates random floats between 0.0 and 1.0
        //std::default_random_engine generator;
        //std::vector<glm::vec3> ssaoKernel;
        let scale: number = 0.0;

        let dataArr: Float32Array = new Float32Array(total * 3);
        let v3: Vector3D = new Vector3D();
        let k: number = 0;
        for (let i: number = 0; i < total; ++i) {
            //v3.setTo(Math.random() * 2.0 - 1.0, 0.8 * (1.0 - scale * scale) + 0.2, Math.random() * 2.0 - 1.0);
            v3.setTo(Math.random() * 2.0 - 1.0, 0.8 * (1.0 - scale * scale) + 0.2, Math.random());
            v3.normalize();
            scale = i / total;
            // Scale samples s.t. they're more aligned to center of kernel
            scale = this.lerp(0.2, 1.0, scale * scale);
            v3.scaleBy(scale);

            dataArr[k] = v3.x;
            dataArr[k + 1] = v3.y;
            dataArr[k + 2] = v3.z;
            k += 3;
        }
        return dataArr;
    }
    createNoiseTex(size: number = 32): IRenderTexture {
        let width: number = size;
        let height: number = width;
        let pixels: Float32Array = new Float32Array(width * height * 4);
        let i: number = 0;
        let j: number = 0;
        let k: number = 0;
        let px: number = 0;
        let py: number = 0;
        for (; i < width; ++i) {
            for (j = 0; j < height; ++j) {
                k = (i * width + j) * 4;
                px = Math.random() * 2.0 - 1.0;
                py = Math.random() * 2.0 - 1.0;
                let noise = this.noise3d(px, py, 0.0);
                pixels[k] = noise;
                pixels[k + 1] = noise;
                pixels[k + 2] = noise;
                pixels[k + 3] = 0.0;
            }
        }

        let tex = this.m_texBlock.createFloatTex2D(width, width, false);
        tex.mipmapEnabled = false;
        tex.minFilter = TextureConst.NEAREST;
        tex.magFilter = TextureConst.NEAREST;
        tex.setDataFromBytes(pixels, 0, width, width, 0,0,false);
        return tex;
    }
    destroy(): void {
        this.m_texBlock = null;
    }
}