/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";
import { Stencil } from "../../vox/render/rendering/Stencil";
import { GLStencilFunc, GLStencilOp } from "../../vox/render/RenderConst";

export default class ConvexTransParentPassItem extends PassRItem {

	stencil0 = new Stencil();
	stencil1 = new Stencil();
	stencil2 = new Stencil();
    color = new Color4();
	constructor() {
		super();
		this.initialize();
		this.initState();
	}
	private initState(): void {

		let stc = this.stencil0;
        stc.setStencilOp(GLStencilOp.KEEP, GLStencilOp.KEEP, GLStencilOp.REPLACE);
        stc.setStencilFunc(GLStencilFunc.ALWAYS, 1, 0xFF);
        stc.setStencilMask(0xFF);

		stc = this.stencil1;
        stc.setStencilFunc(GLStencilFunc.NOTEQUAL, 1, 0xFF);
        stc.setStencilMask(0x0);

		stc = this.stencil2;
        stc.setStencilMask(0xFF);

	}
	run(process: IPassProcess): void {

		if (this.m_enabled && process) {

			const rc = process.rc;
			const unit = process.units[0];
			let entity = unit.rentity;

			// draw pass 0
            process.resetUniform();
			rc.applyStencil(this.stencil0);
			process.run();

			let scale = 1.1;
			let material = entity.getMaterial() as IColorMaterial;
			material.setRGB3f(10.0, 0.0, 0.0);
			entity.setScaleXYZ(scale, scale, scale);
			entity.update();

			// draw pass 1
            process.resetUniform();
			rc.applyStencil(this.stencil1);
			process.run();

			scale = 1.0;
			entity.setScaleXYZ(scale, scale, scale);
			entity.update();
			material.setRGB3f(1.0, 1.0, 1.0);

			// reset stencil mask
			rc.applyStencil(this.stencil2);
		}
	}
}
