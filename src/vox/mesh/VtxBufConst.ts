/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as BitConstT from "../../vox/utils/BitConst";
import BitConst = BitConstT.vox.utils.BitConst;

export namespace vox
{
    export namespace mesh
    {
        export class VtxBufConst
        {
            static VTXTYPE_GL_POINTS:number = 101;
            static VTXTYPE_GL_LINES:number = 102;
            static VTXTYPE_GL_LINE_STRIP:number = 103;
            static VTXTYPE_GL_TRIANGLES:number = 111;

            static VTX_STATIC_DRAW:number = 0;
            static VTX_DYNAMIC_DRAW:number = 1;
            static VTX_STREAM_DRAW:number = 2;
            static VTX_STATIC_READ:number = 3;
            static VTX_DYNAMIC_READ:number = 4;
            static VTX_STREAM_READ:number = 5;
            static VTX_STATIC_COPY:number = 6;
            static VTX_DYNAMIC_COPY:number = 7;
            static VTX_STREAM_COPY:number = 8;

            static VBUF_VS:number = 3001;
            static VBUF_VS2:number = 3002;
            static VBUF_UVS:number = 3003;
            static VBUF_UVS2:number = 3004;
            static VBUF_NVS:number = 3005;
            static VBUF_NVS2:number = 3006;
            static VBUF_CVS:number = 3007;
            static VBUF_CVS2:number = 3008;
            static VBUF_TVS:number = 3009;
            static VBUF_TVS2:number = 3010;
            static VBUF_VS_INDEX:number = BitConst.BIT_ONE_0;
            static VBUF_UVS_INDEX:number = BitConst.BIT_ONE_1;
            static VBUF_NVS_INDEX:number = BitConst.BIT_ONE_2;
            static VBUF_CVS_INDEX:number = BitConst.BIT_ONE_3;
            static VBUF_TVS_INDEX:number = BitConst.BIT_ONE_4;
            static VBUF_VS2_INDEX:number = BitConst.BIT_ONE_5;
            static VBUF_UVS2_INDEX:number = BitConst.BIT_ONE_6;
            static VBUF_NVS2_INDEX:number = BitConst.BIT_ONE_7;
            static VBUF_CVS2_INDEX:number = BitConst.BIT_ONE_8;
            static VBUF_TVS2_INDEX:number = BitConst.BIT_ONE_9;
            // name
            static VBUF_VS_NS:string = "a_vs";
            static VBUF_VS2_NS:string = "a_vs2";
            static VBUF_UVS_NS:string = "a_uvs";
            static VBUF_UVS2_NS:string = "a_uvs2";
            static VBUF_NVS_NS:string = "a_nvs";
            static VBUF_NVS2_NS:string = "a_nvs2";
            static VBUF_CVS_NS:string = "a_cvs";
            static VBUF_CVS2_NS:string = "a_cvs2";
            static VBUF_TVS_NS:string = "a_tvs";
            static VBUF_TVS2_NS:string = "a_tvs2";
            //
            static ToGL(gl:any,param:number):number
            {
                switch(param)
                {
                    case VtxBufConst.VTX_STATIC_DRAW:
                        return gl.STATIC_DRAW;
                        break;
                    case VtxBufConst.VTX_DYNAMIC_DRAW:
                        return gl.DYNAMIC_DRAW;
                        break;
                    case VtxBufConst.VTX_STREAM_DRAW:
                        return gl.STREAM_DRAW;
                        break;                    
                    case VtxBufConst.VTX_STATIC_READ:
                        return gl.STATIC_READ;
                        break;
                    case VtxBufConst.VTX_DYNAMIC_READ:
                        return gl.DYNAMIC_READ;
                        break;
                    case VtxBufConst.VTX_STREAM_READ:
                        return gl.STREAM_READ;
                        break;  
                    case VtxBufConst.VTX_STATIC_COPY:
                        return gl.STATIC_COPY;
                        break;
                    case VtxBufConst.VTX_DYNAMIC_COPY:
                        return gl.DYNAMIC_COPY;
                        break;
                    case VtxBufConst.VTX_STREAM_COPY:
                        return gl.STREAM_COPY;
                        break;
                    default:
                        break;
                }
                return gl.STATIC_DRAW;
            }
            static GetVBufTypeByNS(pns:string):number
            {
                switch(pns)
                {
                    case VtxBufConst.VBUF_VS_NS:
                        return VtxBufConst.VBUF_VS;
                        break;
                    case VtxBufConst.VBUF_UVS_NS:
                        return VtxBufConst.VBUF_UVS;
                        break;
                    case VtxBufConst.VBUF_NVS_NS:
                        return VtxBufConst.VBUF_NVS;
                        break;
                    case VtxBufConst.VBUF_CVS_NS:
                        return VtxBufConst.VBUF_CVS;
                        break;
                    ///////////////////
                    case VtxBufConst.VBUF_VS2_NS:
                        return VtxBufConst.VBUF_VS2;
                        break;
                    case VtxBufConst.VBUF_UVS2_NS:
                        return VtxBufConst.VBUF_UVS2;
                        break;
                    case VtxBufConst.VBUF_NVS2_NS:
                        return VtxBufConst.VBUF_NVS2;
                        break;
                    case VtxBufConst.VBUF_CVS2_NS:
                        return VtxBufConst.VBUF_CVS2;
                        break;
                    case VtxBufConst.VBUF_TVS_NS:
                        return VtxBufConst.VBUF_TVS;
                        break;
                    case VtxBufConst.VBUF_TVS2_NS:
                        return VtxBufConst.VBUF_TVS2;
                        break;
                    default:
                }
                return -1;
            }

            static GetVBufNSByType(type:number):String
            {
                switch(type)
                {
                    case VtxBufConst.VBUF_VS:
                        return VtxBufConst.VBUF_VS_NS;
                        break;
                    case VtxBufConst.VBUF_UVS:
                        return VtxBufConst.VBUF_UVS_NS;
                        break;
                    case VtxBufConst.VBUF_NVS:
                        return VtxBufConst.VBUF_NVS_NS;
                        break;
                    case VtxBufConst.VBUF_CVS:
                        return VtxBufConst.VBUF_CVS_NS;
                        break;
                    ///////////////////
                    case VtxBufConst.VBUF_VS2:
                        return VtxBufConst.VBUF_VS2_NS;
                        break;
                    case VtxBufConst.VBUF_UVS2:
                        return VtxBufConst.VBUF_UVS2_NS;
                        break;
                    case VtxBufConst.VBUF_NVS2:
                        return VtxBufConst.VBUF_NVS2_NS;
                        break;
                    case VtxBufConst.VBUF_CVS2:
                        return VtxBufConst.VBUF_CVS2_NS;
                        break;
                    case VtxBufConst.VBUF_TVS:
                        return VtxBufConst.VBUF_TVS_NS;
                        break;
                    case VtxBufConst.VBUF_TVS2:
                        return VtxBufConst.VBUF_TVS2_NS;
                        break;
                    default:
                }
                return "";
            }
            static GetVBufAttributeTypeByNS(pns:string):number
            {
                return VtxBufConst.GetVBufTypeByNS(pns) - 3000;
            }
        }

        export class VtxNormalType
        {
            static FLAT:number = 210;
            static GOURAND:number = 310;
        }
    }
}