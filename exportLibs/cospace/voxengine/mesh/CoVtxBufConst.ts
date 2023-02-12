/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface CoVtxBufConst {

    VTXTYPE_GL_POINTS: number;// = 101;
    VTXTYPE_GL_LINES: number;// = 102;
    VTXTYPE_GL_LINE_STRIP: number;// = 103;
    VTXTYPE_GL_TRIANGLES: number;// = 111;
    VTX_STATIC_DRAW: number;// = 0;
    VTX_DYNAMIC_DRAW: number;// = 1;
    VTX_STREAM_DRAW: number;// = 2;
    VTX_STATIC_READ: number;// = 3;
    VTX_DYNAMIC_READ: number;// = 4;
    VTX_STREAM_READ: number;// = 5;
    VTX_STATIC_COPY: number;// = 6;
    VTX_DYNAMIC_COPY: number;// = 7;
    VTX_STREAM_COPY: number;// = 8;

    VBUF_VS: number;// = 3001;
    VBUF_UVS: number;// = 3002;
    VBUF_NVS: number;// = 3003;
    VBUF_CVS: number;// = 3004;
    VBUF_TVS: number;// = 3005;
    VBUF_VS2: number;// = 3006;
    VBUF_UVS2: number;// = 3007;
    VBUF_NVS2: number;// = 3008;
    VBUF_CVS2: number;// = 3009;
    VBUF_TVS2: number;// = 3010;

    VBUF_VS_INDEX: number;// = BitConst.BIT_ONE_0;
    VBUF_UVS_INDEX: number;// = BitConst.BIT_ONE_1;
    VBUF_NVS_INDEX: number;// = BitConst.BIT_ONE_2;
    VBUF_CVS_INDEX: number;// = BitConst.BIT_ONE_3;
    VBUF_TVS_INDEX: number;// = BitConst.BIT_ONE_4;
    VBUF_VS2_INDEX: number;// = BitConst.BIT_ONE_5;
    VBUF_UVS2_INDEX: number;// = BitConst.BIT_ONE_6;
    VBUF_NVS2_INDEX: number;// = BitConst.BIT_ONE_7;
    VBUF_CVS2_INDEX: number;// = BitConst.BIT_ONE_8;
    VBUF_TVS2_INDEX: number;// = BitConst.BIT_ONE_9;
    // name
    VBUF_VS_NS: string;// = "a_vs";
    VBUF_VS2_NS: string;// = "a_vs2";
    VBUF_UVS_NS: string;// = "a_uvs";
    VBUF_UVS2_NS: string;// = "a_uvs2";
    VBUF_NVS_NS: string;// = "a_nvs";
    VBUF_NVS2_NS: string;// = "a_nvs2";
    VBUF_CVS_NS: string;// = "a_cvs";
    VBUF_CVS2_NS: string;// = "a_cvs2";
    VBUF_TVS_NS: string;// = "a_tvs";
    VBUF_TVS2_NS: string;// = "a_tvs2";

    ToGL(gl: any, param: number): number;
    GetVBufTypeByNS(pns: string): number;
    GetVBufNSByType(type: number): String;

    GetVBufAttributeTypeByNS(pns: string): number;
    GetVBufAttributeTypeByVBufType(vbufType: number): number;
}
export default CoVtxBufConst;
