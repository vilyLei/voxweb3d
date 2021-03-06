/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";

export default class VROBase implements IVertexRenderObj
{
    protected m_uid:number = 0;            
    // vtx attribute hash map id
    protected m_mid:number = 0;
    protected m_vtxUid:number = 0;
    protected m_rc:IROVtxBuilder = null;
    ibuf:any = null;
    /**
     * be used by the renderer runtime, the value is 2 or 4.
     */
    ibufStep:number = 2;

    constructor()
    {
    }
    setRC(rc:IROVtxBuilder):void
    {
        this.m_rc = rc;
    }
    protected setMidAndBufUid(mid:number,pvtxUid:number):void
    {
        this.m_mid = mid;
        this.m_vtxUid = pvtxUid;
        this.m_attachCount = 0;
    }
    getUid():number
    {
        return this.m_uid;
    }
    getVtxUid():number
    {
        return this.m_vtxUid;
    }
    getMid():number
    {
        return this.m_mid;
    }
    run():void
    {
        
    }
    protected m_attachCount:number = 0;
    __$attachThis():void
    {
        ++this.m_attachCount;
    }
    __$detachThis():void
    {
        --this.m_attachCount;
        if(this.m_attachCount < 1)
        {
            this.m_attachCount = 0;
            //console.log("VROBase::__$detachThis() this.m_attachCount value is 0.");
        }
    }
    protected __$destroy():void
    {
        //console.log("VROBase::__$destroy()..., ("+this.m_uid+")this.m_attachCount: "+this.m_attachCount);
        VROBase.s_midMap.delete(this.m_mid);
        this.m_mid = 0;
        this.m_vtxUid = -1;
        this.ibuf = null;
        this.m_rc = null;
    }
    restoreThis():void
    {
        
    }
    protected static s_midMap:Map<number,IVertexRenderObj> = new Map();
    static HasMid(mid:number):boolean
    {
        return VROBase.s_midMap.has(mid);
    }
    static GetByMid(mid:number):IVertexRenderObj
    {
        return VROBase.s_midMap.get(mid);
    }            
}