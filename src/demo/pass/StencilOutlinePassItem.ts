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

export default class ConvexTransParentPassItem extends PassRItem {

	stencil0 = new Stencil();
	stencil1 = new Stencil();
    color = new Color4();
	constructor() {
		super();
		this.initialize();
	}
	run(process: IPassProcess): void {
		if (this.m_enabled && process) {

			const unit = process.units[0];
			let entity = unit.rentity;
			let rdst = process.rc.RDrawState;
			let stencil = process.rc.stencil;
            
			stencil.setStencilMask(0x0);
			this.stencil0.apply(rdst);

			process.run();
			this.stencil1.apply(rdst);

			let scale = 1.1;
			let material = entity.getMaterial() as IColorMaterial;
			material.setRGB3f(20.0, 0.0, 0.0);
			entity.setScaleXYZ(scale, scale, scale);
			entity.update();
            process.resetUniform();
			process.run();

			scale = 1.0;
			entity.setScaleXYZ(scale, scale, scale);
			material.setRGB3f(1.0, 1.0, 1.0);

			stencil.setStencilMask(0xff);
		}
	}
}
