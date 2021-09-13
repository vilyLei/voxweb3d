/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";

interface IRenderCamera {
    
    version: number;
    matUProbe: IShaderUniformProbe;
    ufrustumProbe: IShaderUniformProbe;
    uniformEnabled: boolean;
    // 不允许外界修改camera数据
    lock(): void;
    // 允许外界修改camera数据
    unlock(): void;
    lookAtLH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void;
    lookAtRH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void;
    
    perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number): void;
    perspectiveRH(fovy: number, aspect: number, zNear: number, zFar: number): void;
    perspectiveRH2(fovy: number, pw: number, ph: number, zNear: number, zFar: number): void;
    getAspect(): number;
    getViewFieldZoom(): number;
    orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void;
    orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void;
    isPerspectiveEnabled(): boolean;
    isRightHandEnabled(): boolean;
    setViewXY(px: number, py: number): void;
    setViewSize(pw: number, ph: number): void;
    getViewX(): number;
    getViewY(): number;
    getViewWidth(): number;
    getViewHeight(): number;
    
    getPerspectiveEnabled(): boolean;
    setPerspectiveEnabled(boo: boolean): void;

    screenXYToViewXYZ(px: number, py: number, outV: Vector3D): void;
    screenXYToWorldXYZ(px: number, py: number, outV: Vector3D): void;
    getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: Vector3D, ray_tv: Vector3D): void;
    calcScreenNormalizeXYByWorldPos(pv3: Vector3D, scPV3: Vector3D): void;
    worldPosToScreen(pv: Vector3D): void;
    
    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间
    calcScreenRectByWorldSphere(pv: Vector3D, radius: number, outV: Vector3D): void;
    getZNear(): number;
    setZNear(value: number): void;
    getZFar(): number;
    setZFar(value: number): void;
    getNearPlaneWidth(): number;
    setNearPlaneWidth(value: number): void;
    getNearPlaneHeight(): number;
    setNearPlaneHeight(value: number): void;
    getFov(): number;
    
    getWordFrustumWAABBCenter(): Vector3D;
    visiTestSphere2(w_cv: Vector3D, radius: number): boolean;

    visiTestSphere3(w_cv: Vector3D, radius: number, farROffset: number): boolean;
    visiTestPosition(pv: Vector3D): boolean;
    visiTestPlane(nv: Vector3D, distance: number): boolean;
    //this.m_wFruPlaneList
    // frustum intersect sphere in wrod space
    visiTestSphere(w_cv: Vector3D, radius: number): boolean;
    // visibility test
    // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
    // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
    visiTestAABB(ab: AABB): boolean;
    
    update(): void
    updateCamMatToUProbe(uniformProbe: IShaderUniformProbe): void;
    lookRHEnabled(): boolean;
    lookLHEnabled(): boolean;
}

export {IRenderCamera};