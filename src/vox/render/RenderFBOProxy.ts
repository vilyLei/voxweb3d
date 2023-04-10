/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RCExtension from "../../vox/render/RCExtension";
import RAdapterContext from "../../vox/render/RAdapterContext";

class RenderFBOProxy {
	private static m_rc: any = null;
	private static m_webGLVer = 2;
	public static readonly COLOR_ATTACHMENT0 = 0x0;
	static SetRenderer(pr: RAdapterContext): void {
		RenderFBOProxy.m_rc = pr.getRC();
		RenderFBOProxy.m_webGLVer = pr.getWebGLVersion();
		let thisT: any = RenderFBOProxy;
		if (RenderFBOProxy.m_webGLVer == 1) {
			if (RCExtension.WEBGL_draw_buffers != null) {
				thisT.COLOR_ATTACHMENT0 = RCExtension.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL;
			} else {
				thisT.COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
			}
		} else {
			thisT.COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
		}
	}
	static DrawBuffers(attachments: number[]): void {
		if (RenderFBOProxy.m_webGLVer == 2) {
			RenderFBOProxy.m_rc.drawBuffers(attachments);
		} else if (RCExtension.WEBGL_draw_buffers != null) {
			RCExtension.WEBGL_draw_buffers.drawBuffersWEBGL(attachments);
		}
	}
}
export default RenderFBOProxy;
