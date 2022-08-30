/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IColor4 from '../../../vox/material/IColor4';
import IRawMesh from '../../../vox/mesh/IRawMesh';

interface ILineMeshBuilder {

    color: IColor4;
    /**
     * the default value is true
     */
    dynColorEnabled: boolean;
    
    setRGB3f(pr: number, pg: number, pb: number): void;
    createLine(begin: IVector3D, end?: IVector3D): IRawMesh;
    createRectXOY(px: number, py: number, pw: number, ph: number): IRawMesh;
    createRectXOZ(px: number, pz: number, pw: number, pl: number): IRawMesh;
    createRectYOZ(px: number, pz: number, pw: number, pl: number): IRawMesh;

    createCircleXOY(radius: number, segsTotal: number, center?: IVector3D): IRawMesh;
    createCircleXOZ(radius: number, segsTotal: number, center?: IVector3D): IRawMesh;
    createCircleYOZ(radius: number, segsTotal: number, center?: IVector3D): IRawMesh;

    createCurveByPositions(posList: IVector3D[], colorList: IColor4[]): IRawMesh;
    createPolygon(posList: IVector3D[], colorList: IColor4[]): IRawMesh;
    destroy(): void;
}
export {ILineMeshBuilder}