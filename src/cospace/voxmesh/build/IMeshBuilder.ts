/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IMatrix4 from "../../../vox/math/IMatrix4";

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
    
}

export { IMeshBuilder }