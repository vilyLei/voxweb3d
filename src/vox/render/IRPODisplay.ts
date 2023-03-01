/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被操作对象的行为规范

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";

interface IRPODisplay {
    value: number;
    pos: IVector3D;
    bounds: IAABB;
    updateVtx(): boolean;
    setDrawFlag(renderState: number, rcolorMask: number): void;
    setIvsParam(ivsIndex: number, ivsCount: number): void;
    setVisible(boo: boolean): void;
    /**
     * get RPONode instance unique id
     */
    getRPOUid(): number;
    /**
     * get RenderProcess instance unique id
     */
    getRPROUid(): number;
    /**
     * get Renderer shader instance unique id
     */
    getShaderUid(): number;
}
export default IRPODisplay;