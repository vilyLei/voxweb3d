/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROTextureResource from '../../vox/render/ROTextureResource';
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

function getNearestCeilPow2(int_n: number): number {
	let x = 1;
	while (x < int_n) {
		x <<= 1;
	}
	return x;
}
/**
 * renderer runtime texture resource object
 */
class TextureRenderObj implements ITextureRenderObj {
    private static s_uid: number = 0;
    private static s_troMaps: Map<number, TextureRenderObj>[] = [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()];
    private static s_freeTROList: TextureRenderObj[] = [];
    protected static s_unloacked: boolean = true;
    protected static s_preMid: number = -1;

    private m_uid: number = -1;
    protected m_mid: number = -1;
    protected m_texTotal: number = 0;
    // max texture amount: 8
    private m_gtexList: any[] = null;
    protected m_samplers: Uint16Array = null;
    protected m_texList: IRenderTexture[] = null;
    // renderer context uid
    private m_rcuid: number = 0;
    private m_texRes: ROTextureResource = null;
    // 是否收集gpu数据直接使用，true表示需要收集
    direct: boolean = true;
    private constructor(rcuid: number, texListHashId: number) {
        this.m_rcuid = rcuid;
        this.m_uid = TextureRenderObj.s_uid++;
        this.m_mid = texListHashId;
    }
    private __$setParam(rcuid: number, texListHashId: number): void {
        this.m_rcuid = rcuid;
        this.m_mid = texListHashId;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    getMid(): number {
        return this.m_mid;
    }
    getTexTotal(): number {
        return this.m_texTotal;
    }

    protected collectTexList(texRes: ROTextureResource, ptexList: IRenderTexture[], shdTexTotal: number): void {
        this.m_texRes = texRes;
        let i: number = 0;
        if (this.direct) {
            if (this.m_texTotal < 1 && ptexList.length > 0) {
                let len: number = getNearestCeilPow2(ptexList.length);
                this.m_samplers = new Uint16Array(len);
                this.m_gtexList = new Array(len);
                this.m_texList = ptexList;
                let tex: IRenderTexture;
                while (i < shdTexTotal) {
                    tex = ptexList[i];
                    tex.__$attachThis();
                    tex.__$$upload(texRes);
                    this.m_samplers[i] = tex.getSampler();
                    this.m_gtexList[i] = this.m_texRes.getGpuBuffer(tex.getResUid());
                    this.m_texRes.__$attachRes(tex.getResUid());
                    i++;
                }

                this.m_texTotal = i;
            }
            else {
                this.m_texTotal = 0;
            }
        }
        else {
            this.m_texTotal = shdTexTotal;
        }
        while (i < ptexList.length) {
            ptexList[i++].__$attachThis();
        }
    }
    // 注意: 移动端要注意这里的切换机制是符合移动端低带宽的特点
    run(): void {
        //console.log("this.m_texRes.unlocked: ",this.m_texRes.unlocked,this.m_texRes.texMid != this.m_mid);
        if (this.m_texRes.unlocked && this.m_texRes.texMid != this.m_mid) {
            this.m_texRes.texMid = this.m_mid;
            // console.log("TextureRenderObj::run(), this.m_mid: ",this.m_mid,this.m_uid, this.m_texList);
            let gl: any = this.m_texRes.getRC();
            let texI = gl.TEXTURE0;
            if (this.direct) {
                //console.log("this.m_gtexList: ",this.m_gtexList,", total: "+this.m_texTotal);
                for (let i = 0; i < this.m_texTotal; ++i) {
                    gl.activeTexture(texI++);
                    gl.bindTexture(this.m_samplers[i], this.m_gtexList[i]);
                }
            }
            else {
                let list: IRenderTexture[] = this.m_texList;
                for (let i = 0; i < this.m_texTotal; ++i) {
                    gl.activeTexture(texI++);
                    list[i].__$$use(this.m_texRes);
                }
            }
        }
    }
    getUid(): number {
        return this.m_uid;
    }
    // 自身的引用计数器
    private m_attachCount: number = 0;
    __$attachThis(): void {
        ++this.m_attachCount;
    }
    __$detachThis(): void {
        --this.m_attachCount;
        //console.log("TextureRenderObj::__$detachThis() this.m_attachCount: "+this.m_attachCount);
        if (this.m_attachCount < 1) {
            this.m_attachCount = 0;
            //console.log("TextureRenderObj::__$detachThis() this.m_attachCount value is 0.");
            TextureRenderObj.Restore(this);
        }
    }
    reset(): void {
        if (this.m_texList != null) {
            for (let i = 0, len = this.m_texList.length; i < len; ++i) {
                this.m_texList[i].__$detachThis();
                this.m_texRes.__$detachRes(this.m_texList[i].getResUid());
                this.m_gtexList[i] = null;
            }
        }
        this.m_texTotal = 0;
        this.m_texList = null;
        this.m_texRes = null;
    }

    static Create(texRes: ROTextureResource, texList: IRenderTexture[], shdTexTotal: number): TextureRenderObj {
        let texTotal = texList.length;
        if (texTotal > 0 && shdTexTotal > 0) {
            if (texTotal < shdTexTotal) {
                throw Error("There are fewer textures than in the shader : (need " + shdTexTotal + ",but only have " + texTotal + ") !!!");
                return null;
            }
            let key = 31;
            let t = 0;
            let direct = true;
            while (t < shdTexTotal) {
                key = key * 131 + texList[t].getUid();
                if (!texList[t].isDirect()) {
                    direct = false;
                }
                ++t;
            }
            let rtoMap: Map<number, TextureRenderObj> = TextureRenderObj.s_troMaps[texRes.getRCUid()];
            let tro: TextureRenderObj = null;
            if (rtoMap.has(key)) {
                tro = rtoMap.get(key);
            }
            else {
				const fts = TextureRenderObj.s_freeTROList;
                if (fts.length < 1) {
                    tro = new TextureRenderObj(texRes.getRCUid(), key);
                    // console.log("TextureRenderObj::Create use a new tex mid: " + tro.getMid(),",total: "+shdTexTotal,",key: "+key);
                }
                else {
                    tro = fts.pop();
                    // console.log("TextureRenderObj::Create use an old tex mid: " + tro.getMid(),",total: "+shdTexTotal,",key: "+key);
                }
                tro.collectTexList(texRes, texList, shdTexTotal);
                rtoMap.set(key, tro);
            }
            tro.__$setParam(texRes.getRCUid(), key);
            tro.direct = direct;
            return tro;
        }
        return null;
    }
    private static Restore(tro: TextureRenderObj): void {
        if (tro.getMid() > -1) {
            //console.log("TextureRenderObj::Restore tro.getMid(): "+tro.getMid());
            TextureRenderObj.s_troMaps[tro.getRCUid()].delete(tro.getMid());
            tro.__$setParam(0, 0);
            TextureRenderObj.s_freeTROList.push(tro);
            tro.reset();
        }
    }

    static GetByMid(rcuid: number, uid: number): TextureRenderObj {
        return TextureRenderObj.s_troMaps[rcuid].get(uid);
    }
	static Clear(rcuid: number): void {
		let ls = TextureRenderObj.s_troMaps;
		ls[rcuid].clear();
		// for(let i = 0; i < ls.length; ++i) {
		// 	ls[i].clear();
		// }
		// TextureRenderObj.s_freeTROList = [];
		console.log("TextureRenderObj::Clear(), rcuid: ", rcuid);
	}
}

class EmptyTexRenderObj implements ITextureRenderObj {
    private m_texRes: ROTextureResource = null;
    constructor(texRes: ROTextureResource) {
        this.m_texRes = texRes;
    }
    run(): void {
        this.m_texRes.renderBegin();
    }
    getMid(): number {
        return 1;
    }
    __$attachThis(): void {
    }
    __$detachThis(): void {
    }
}
export {TextureRenderObj, EmptyTexRenderObj};
export default TextureRenderObj;
