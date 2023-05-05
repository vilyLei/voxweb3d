/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IColor4 from '../../../vox/material/IColor4';
import IRawMesh from '../../../vox/mesh/IRawMesh';
import { IMeshBuilder } from "./IMeshBuilder";

interface ILineMeshBuilder extends IMeshBuilder {

    color: IColor4;
    /**
     * the default value is true
     */
    dynColorEnabled: boolean;
    
    setRGB3f(pr: number, pg: number, pb: number): void;
    createLine(begin: IVector3D, end?: IVector3D, axialRadius?: number): IRawMesh;

    createRectXOY(px: number, py: number, pw: number, ph: number): IRawMesh;
    createRectXOZ(px: number, pz: number, pw: number, pl: number): IRawMesh;
    createRectYOZ(px: number, pz: number, pw: number, pl: number): IRawMesh;

    createCircleXOY(radius: number, segsTotal: number, center?: IVector3D, beginRad?: number, rangeRad?: number): IRawMesh;
    createCircleXOZ(radius: number, segsTotal: number, center?: IVector3D, beginRad?: number, rangeRad?: number): IRawMesh;
    createCircleYOZ(radius: number, segsTotal: number, center?: IVector3D, beginRad?: number, rangeRad?: number): IRawMesh;

    createCurveByPositions(posList: IVector3D[], colorList: IColor4[]): IRawMesh;
    createPolygon(posList: IVector3D[], colorList: IColor4[]): IRawMesh;
    createLines(linePosList: IVector3D[], colorList?: IColor4[]): IRawMesh;
    createLinesWithFS32(posvs: Float32Array, colorvs?: Float32Array): IRawMesh;
    destroy(): void;
}
export {ILineMeshBuilder}