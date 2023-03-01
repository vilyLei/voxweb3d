/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRShaderUniform from "../../vox/render/uniform/IRShaderUniform";
import IRUniformUser from "./uniform/IRUniformUser";
/**
 * renderer rendering runtime uniform data operations
 */
export default interface IRenderShader extends IRUniformUser {
    drawFlag: number;
    resetRenderState(): void;
	renderBegin():void;
	bindToGpu(uid: number): void;
	unlock(): void;
	lock(): void;
	textureUnlock(): void;
	textureLock(): void;
	resetUniform(): void;
	resetTransUniform(): void;

    useTransUniform(runiform: IRShaderUniform): void;
    useUniform(runiform: IRShaderUniform): void;
	updateUniform(uniform: IRShaderUniform): void;
    useUniformToCurrentShd(uniform: IRShaderUniform): void;
    useUniform2ToCurrentShd(uniform: IRShaderUniform, transUniform: IRShaderUniform): void;
}
