/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../../vox/material/IVtxShdCtr";
import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../../vox/render/IVertexRenderObj";
import VertexRenderObj from "../../../vox/render/VertexRenderObj";
import VaoVertexRenderObj from "../../../vox/render/VaoVertexRenderObj";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import { ROIndicesRes } from "./ROIndicesRes";

class ROVertexModifier {
	
	version: number;
	private m_vtx: IROVtxBuf = null;
	constructor() {}
}
export { ROVertexModifier };
