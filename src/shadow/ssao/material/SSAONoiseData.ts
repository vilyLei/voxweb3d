/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Matrix4 from "../../../vox/math/Matrix4";
import MathConst from "../../../vox/math/MathConst";
import Vector3D from "../../../vox/math/Vector3D";
import TextureBlock from "../../../vox/texture/TextureBlock";
import FloatTextureProxy from "../../../vox/texture/FloatTextureProxy";

export default class SSAONoiseData
{
    private m_u8Pixels: Float32Array = null;
    private m_texBlock:TextureBlock = null;
    constructor(){}

    initialize(texBlock:TextureBlock): void {
        this.m_texBlock = texBlock;
    }
    private lerp(a: number, b: number, f: number): number
    {
        return a + f * (b - a);
    }
    calcSampleKernel(total: number,type: number = 0): Float32Array
    {
        //std::uniform_real_distribution<GLfloat> randomFloats(0.0, 1.0); // generates random floats between 0.0 and 1.0
        //std::default_random_engine generator;
        //std::vector<glm::vec3> ssaoKernel;
        let scale: number = 0.0;
        let dataArr: Float32Array = null;
        ///*
        if(type == 0) {
            dataArr = new Float32Array([
                -0.03235803784003493,   0.001585823784285346,   0.038566134356142645,   -0.00046060874862669345,
                -0.002772005506981998,  0.0051313334622426175,  0.04856469052504219,    -0.011930993270554417,
                0.0597608894338323,     -0.008310038289413084,  0.004391223041509458,   0.010047828697894818,
                -0.06196600274858307,   0.00422680168901238,    0.15932505284836787,    0.012538884438134813,
                -0.03518876541075045,   0.04218624828304494,    -0.02943238819904252,   0.0997011337685477,
                0.1288117554569383,     0.15237151606605176,    0.1932517383538349,     0.19862488996572203,
                0.041456847350090635,   -0.035743268292415746,  0.08050385505625032,    0.36640333840317946,
                -0.5116343777072901,    0.4944038858156491
            ]);
        }
        //*/
        if(dataArr != null && dataArr.length > 0)
        {
            console.log("dataArr.length: "+dataArr.length);
            return dataArr;
        }
        else {
            dataArr = new Float32Array(total * 3);
        }
        let v3 = new Vector3D();
        let str = "";
        let k: number = 0;
        for (let i = 0; i < total; ++i)
        {
            //glm::vec3 sample(randomFloats(generator) * 2.0 - 1.0, randomFloats(generator) * 2.0 - 1.0, randomFloats(generator));
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random());
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() + 0.001);
            v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, 0.9 * (1.0 - scale * scale) + 0.2);
            v3.normalize();
            //sample = glm::normalize(sample);
            //sample *= randomFloats(generator);
            v3.scaleBy(Math.random());
            scale = i / total;
            // Scale samples s.t. they're more aligned to center of kernel
            scale = this.lerp(0.1, 1.0, scale * scale);
            //sample *= scale;
            v3.scaleBy( scale );
            //ssaoKernel.push_back(sample);
            str += ","+v3.x+","+v3.y+","+v3.z;
            //dataArr.push(v3.x,v3.y,v3.z);
            //trace(v3.x+",",v3.y+",",v3.z);
            dataArr[k] = v3.x;
            dataArr[k+1] = v3.y;
            dataArr[k+2] = v3.z;
            k += 3;
        }
        console.log(str);
        return dataArr;
    }
    calcSampleKernel2(total: number): Float32Array
    {
        //std::uniform_real_distribution<GLfloat> randomFloats(0.0, 1.0); // generates random floats between 0.0 and 1.0
        //std::default_random_engine generator;
        //std::vector<glm::vec3> ssaoKernel;
        let scale: number = 0.0;
        
        let dataArr: Float32Array = new Float32Array(total * 3);
        let v3: Vector3D = new Vector3D();
        let k: number = 0;
        for (let i: number = 0; i < total; ++i)
        {
            //glm::vec3 sample(randomFloats(generator) * 2.0 - 1.0, randomFloats(generator) * 2.0 - 1.0, randomFloats(generator));
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random());
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() + 0.001);
            //v3.setTo(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, (1.0 - scale * scale) + 0.05);
            v3.setTo(Math.random() * 2.0 - 1.0, 0.8 * (1.0 - scale * scale) + 0.2, Math.random() * 2.0 - 1.0);
            v3.normalize();
            //sample = glm::normalize(sample);
            //sample *= randomFloats(generator);
            v3.scaleBy(Math.random());
            scale = i / total;
            // Scale samples s.t. they're more aligned to center of kernel
            scale = this.lerp(0.2, 1.0, scale * scale);
            //sample *= scale;
            v3.scaleBy( scale );
            //ssaoKernel.push_back(sample);
            //dataArr.push(v3.x,v3.y,v3.z);
            //trace(v3.x+",",v3.y+",",v3.z);

            dataArr[k] = v3.x;
            dataArr[k+1] = v3.y;
            dataArr[k+2] = v3.z;
            k += 3;
        }
        return dataArr;
    }
    createNoiseTex(): FloatTextureProxy
    {
        let width: number = 32;
        let height: number = width;
        let pixels: Float32Array = new Float32Array(width * height * 4);
        let i: number = 0;
        let j: number = 0;
        let k: number = 0;
        let px: number = 0;
        let py: number = 0;
        for(; i < width; ++i)
        {
            for(j = 0; j < height; ++j)
            {
                k = (i * width + j) * 4;
                //trace("k: "+k);
                px = Math.random() * 2.0 - 1.0;
                py = Math.random() * 2.0 - 1.0;                
                pixels[k] = px;
                pixels[k+1] = py;
                pixels[k+2] = 0.0;
                pixels[k+3] = 0.0;
                //pixels[k+1] = i * j;
                //trace(px,","+py);
            }
        }

        this.m_u8Pixels = pixels;

        let tex: FloatTextureProxy = this.m_texBlock.createFloatTex2D(width, width);
        tex.mipmapEnabled = true;
        tex.setDataFromBytes(pixels, 0, width, width);
        return tex;
    }
    destroy(): void {
        this.m_texBlock = null;
    }
}