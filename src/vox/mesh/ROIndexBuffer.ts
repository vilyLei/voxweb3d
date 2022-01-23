/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

//  import RenderProxy from "../../vox/render/RenderProxy";
//  import VtxBufConst from "../../vox/mesh/VtxBufConst";
//  //import RenderProxy = RenderProxyT.vox.render.RenderProxy;
//  //import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;

export namespace vox
{
    export namespace mesh
    {        
        export class ROIndexBuffer
        {
            /*
            private m_rc:RenderProxy = null;
            //
            private m_type:number = 0;
            private m_ivs:Uint16Array = null;
            private m_ivsBuf:any = null;
            private m_ivsStatus:number = VtxBufConst.VTX_STATIC_DRAW;
            ivsCount:number = 0;
            //
            getType(){ return this.m_type};
            setUintIVSData(uint16Arr:Uint16Array,status:number):void
            {
                if(this.m_ivs != null && uint16Arr != null)
                {
                    if(status == undefined) this.m_ivsStatus = VtxBufConst.VTX_STATIC_DRAW;
                    else this.m_ivsStatus = status;
                    if(this.m_rc != null && this.m_ivsBuf != null)
                    {
                        if(this.m_ivs.length == uint16Arr.length)
                        {
                            this.m_ivs = uint16Arr;
                            this.m_rc.bindEleBuf(this.m_ivsBuf);
                            this.m_rc.eleBufData(this.m_ivs, this.m_ivsStatus);
                        }
                        else
                        {
                            this.m_ivs = uint16Arr;
                            this.m_rc.deleteBuf(this.m_ivsBuf);
                            this.m_ivsBuf = this.m_rc.createBuf();
                            this.m_rc.bindEleBuf(this.m_ivsBuf);
                            this.m_rc.eleBufData(this.m_ivs, this.m_ivsStatus);
                        }
                    }
                    else
                    {
                        this.m_ivs = uint16Arr;
                    }
                    this.ivsCount = this.m_ivs.length;
                }
                else
                {    
                    this.m_ivs = uint16Arr;
                }
            }
            isEnabled():boolean{return this.m_rc != null;}
            upload(rc:RenderProxy):void
            {
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    if(this.m_ivs != null)
                    {
                        if(this.m_ivsBuf != null)
                        {
                            rc.deleteBuf(this.m_ivsBuf);
                        }
                        this.m_ivsBuf = rc.createBuf();
                        rc.bindEleBuf(this.m_ivsBuf);
                        rc.eleBufData(this.m_ivs, this.m_ivsStatus);
                        this.ivsCount = this.m_ivs.length;
                    }
                }
            }
            use():void
            {
                if(this.m_rc != null)
                {
                    if(this.m_ivsBuf != null)
                    {
                        this.m_rc.bindEleBuf(this.m_ivsBuf);
                    }
                }
            }
            createVRO():void
            {
                if(this.m_rc != null)
                {
                    if(this.m_ivsBuf != null)
                    {
                        this.m_rc.bindEleBuf(this.m_ivsBuf);
                    }
                }
            }
            destroy():void
            {
                if(this.m_rc != null)
                {
                    if(this.m_ivsBuf != null)
                    {
                        this.m_rc.deleteBuf(this.m_ivsBuf);
                        this.m_ivsBuf = null;
                    }
                    this.m_ivs = null; 
                    this.m_rc = null;
                }
            }
            toString():string
            {
                return "ROIndexBuffer()";
            }
            //*/
        }
    }
}