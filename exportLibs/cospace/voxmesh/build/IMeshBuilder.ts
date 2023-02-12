/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMatrix4 from "../../../vox/math/IMatrix4";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

interface IMeshBuilder {

    vbWholeDataEnabled: boolean;
    wireframe: boolean;
    polyhedral: boolean;
    transMatrix: IMatrix4;
    
    /**
	 * @param layoutBit vertex shader vertex attributes layout bit status.
	 *                  the value of layoutBit comes from the material shdder program.
	 */
    setBufSortFormat(layoutBit: number): void;
    
    applyMaterial(material: IRenderMaterial, texEnabled: boolean): void;
}

export { IMeshBuilder }