/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import BC from "../../vox/utils/BitConst";
import VtxNormalType from "./VtxNormalType";

class VtxBufConst {
    static VTXTYPE_GL_POINTS = 101;
    static VTXTYPE_GL_LINES = 102;
    static VTXTYPE_GL_LINE_STRIP = 103;
    static VTXTYPE_GL_TRIANGLES = 111;
    static VTX_STATIC_DRAW = 0;
    static VTX_DYNAMIC_DRAW = 1;
    static VTX_STREAM_DRAW = 2;
    static VTX_STATIC_READ = 3;
    static VTX_DYNAMIC_READ = 4;
    static VTX_STREAM_READ = 5;
    static VTX_STATIC_COPY = 6;
    static VTX_DYNAMIC_COPY = 7;
    static VTX_STREAM_COPY = 8;

    static VBUF_VS = 3001;
    static VBUF_UVS = 3002;
    static VBUF_NVS = 3003;
    static VBUF_CVS = 3004;
    static VBUF_TVS = 3005;

    static VBUF_VS2 = 3006;
    static VBUF_UVS2 = 3007;
    static VBUF_NVS2 = 3008;
    static VBUF_CVS2 = 3009;
    static VBUF_TVS2 = 3010;

    static VBUF_VS_INDEX = BC.BIT_ONE_0;
    static VBUF_UVS_INDEX = BC.BIT_ONE_1;
    static VBUF_NVS_INDEX = BC.BIT_ONE_2;
    static VBUF_CVS_INDEX = BC.BIT_ONE_3;
    static VBUF_TVS_INDEX = BC.BIT_ONE_4;
    static VBUF_VS2_INDEX = BC.BIT_ONE_5;
    static VBUF_UVS2_INDEX = BC.BIT_ONE_6;
    static VBUF_NVS2_INDEX = BC.BIT_ONE_7;
    static VBUF_CVS2_INDEX = BC.BIT_ONE_8;
    static VBUF_TVS2_INDEX = BC.BIT_ONE_9;
    // attributes name
    static VBUF_VS_NS = "a_vs";
    static VBUF_VS2_NS = "a_vs2";
    static VBUF_UVS_NS = "a_uvs";
    static VBUF_UVS2_NS = "a_uvs2";
    static VBUF_NVS_NS = "a_nvs";
    static VBUF_NVS2_NS = "a_nvs2";
    static VBUF_CVS_NS = "a_cvs";
    static VBUF_CVS2_NS = "a_cvs2";
    static VBUF_TVS_NS = "a_tvs";
    static VBUF_TVS2_NS = "a_tvs2";
    
    static ToGL(gl: any, param: number): number {
		const vbc = VtxBufConst;
        switch (param) {
            case vbc.VTX_STATIC_DRAW:
                return gl.STATIC_DRAW;
                break;
            case vbc.VTX_DYNAMIC_DRAW:
                return gl.DYNAMIC_DRAW;
                break;
            case vbc.VTX_STREAM_DRAW:
                return gl.STREAM_DRAW;
                break;
            case vbc.VTX_STATIC_READ:
                return gl.STATIC_READ;
                break;
            case vbc.VTX_DYNAMIC_READ:
                return gl.DYNAMIC_READ;
                break;
            case vbc.VTX_STREAM_READ:
                return gl.STREAM_READ;
                break;
            case vbc.VTX_STATIC_COPY:
                return gl.STATIC_COPY;
                break;
            case vbc.VTX_DYNAMIC_COPY:
                return gl.DYNAMIC_COPY;
                break;
            case vbc.VTX_STREAM_COPY:
                return gl.STREAM_COPY;
                break;
            default:
                break;
        }
        return gl.STATIC_DRAW;
    }
    static GetVBufTypeByNS(pns: string): number {
		const vbc = VtxBufConst;
        switch (pns) {
            case vbc.VBUF_VS_NS:
                return vbc.VBUF_VS;
                break;
            case vbc.VBUF_UVS_NS:
                return vbc.VBUF_UVS;
                break;
            case vbc.VBUF_NVS_NS:
                return vbc.VBUF_NVS;
                break;
            case vbc.VBUF_CVS_NS:
                return vbc.VBUF_CVS;
                break;
            ///////////////////
            case vbc.VBUF_VS2_NS:
                return vbc.VBUF_VS2;
                break;
            case vbc.VBUF_UVS2_NS:
                return vbc.VBUF_UVS2;
                break;
            case VtxBufConst.VBUF_NVS2_NS:
                return VtxBufConst.VBUF_NVS2;
                break;
            case vbc.VBUF_CVS2_NS:
                return vbc.VBUF_CVS2;
                break;
            case vbc.VBUF_TVS_NS:
                return vbc.VBUF_TVS;
                break;
            case vbc.VBUF_TVS2_NS:
                return vbc.VBUF_TVS2;
                break;
            default:
        }
        return -1;
    }
    static GetVBufNSByType(type: number): String {
		const vbc = VtxBufConst;
        switch (type) {
            case vbc.VBUF_VS:
                return vbc.VBUF_VS_NS;
                break;
            case vbc.VBUF_UVS:
                return vbc.VBUF_UVS_NS;
                break;
            case vbc.VBUF_NVS:
                return vbc.VBUF_NVS_NS;
                break;
            case vbc.VBUF_CVS:
                return vbc.VBUF_CVS_NS;
                break;
            ///////////////////
            case vbc.VBUF_VS2:
                return vbc.VBUF_VS2_NS;
                break;
            case vbc.VBUF_UVS2:
                return vbc.VBUF_UVS2_NS;
                break;
            case vbc.VBUF_NVS2:
                return vbc.VBUF_NVS2_NS;
                break;
            case vbc.VBUF_CVS2:
                return vbc.VBUF_CVS2_NS;
                break;
            case vbc.VBUF_TVS:
                return vbc.VBUF_TVS_NS;
                break;
            case vbc.VBUF_TVS2:
                return vbc.VBUF_TVS2_NS;
                break;
            default:
        }
        return "";
    }
    static GetVBufAttributeTypeByNS(pns: string): number {
        return VtxBufConst.GetVBufTypeByNS(pns) - 3000;
    }
    static GetVBufAttributeTypeByVBufType(vbufType: number): number {
        return vbufType - 3000;
    }
}


export default VtxBufConst;
export { VtxNormalType };
