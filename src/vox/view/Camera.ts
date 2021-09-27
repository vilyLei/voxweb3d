/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import {IRenderCamera} from "../../vox/render/IRenderCamera";

class Camera implements IRenderCamera{

    protected m_uslotIndex: number = 0;
    
    protected m_tempV: Vector3D = new Vector3D()
    protected m_tempV1: Vector3D = new Vector3D();
    protected m_initRV: Vector3D = new Vector3D();
    protected m_initUP: Vector3D = new Vector3D();
    protected m_lookRHEnabled: boolean = true;

    protected m_camPos: Vector3D = new Vector3D();
    protected m_lookAtPos: Vector3D = new Vector3D();
    protected m_up: Vector3D = new Vector3D();
    protected m_lookDirectNV: Vector3D = new Vector3D();
    protected m_lookAtDirec: Vector3D = new Vector3D();

    protected m_frustumWAABB: AABB = new AABB();

    protected m_nearPlaneWidth: number = 1.0;
    protected m_nearPlaneHeight: number = 1.0;
    protected m_viewX: number = 0.0;
    protected m_viewY: number = 0.0;
    protected m_viewW: number = 800.0
    protected m_viewH: number = 600.0;
    protected m_viewHalfW: number = 400.0
    protected m_viewHalfH: number = 300.0;
    protected m_fovy: number = 0.0;
    protected m_aspect: number = 1.0;
    protected m_zNear: number = 0.1;
    protected m_zFar: number = 1000.0;
    protected m_b: number = 0.0;
    protected m_t: number = 0.0;
    protected m_l: number = 0.0;
    protected m_r: number = 0.0;
    protected m_perspectiveEnabled: boolean = false;
    protected m_project2Enabled: boolean = false;
    protected m_rightHandEnabled: boolean = true;
    protected m_rotV: Vector3D = new Vector3D(0.0,0.0,0.0);
    protected m_scaleV: Vector3D = new Vector3D(1.0,1.0,1.0);
    
    protected m_viewFieldZoom: number = 1.0;
    protected m_changed: boolean = true;
    protected m_unlock: boolean = true;

    constructor(uslotIndex: number) {
        this.m_uslotIndex = uslotIndex;
    }
    version: number = 0;
    matUProbe: IShaderUniformProbe = null;
    ufrustumProbe: IShaderUniformProbe = null;
    uniformEnabled: boolean = false;
    name = "Camera";
    

    // 不允许外界修改camera数据
    lock(): void {
        this.m_unlock = false;
    }
    // 允许外界修改camera数据
    unlock(): void {
        this.m_unlock = true;
    }
    lookAtLH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(camPos);
            this.m_lookAtPos.copyFrom(lookAtPos);
            this.m_up.copyFrom(up);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookRHEnabled = false;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_initUP.copyFrom(up);
            this.m_initUP.normalize();
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    lookAtRH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(camPos);
            this.m_lookAtPos.copyFrom(lookAtPos);
            this.m_up.copyFrom(up);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_initUP.copyFrom(up);
            this.m_initUP.normalize();
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    
    getLookAtLHToCamera(camera: Camera): void {
        camera.lookAtLH(this.m_camPos, this.m_lookAtPos, this.m_up);
    }
    getLookAtRHToCamera(camera: Camera): void {
        camera.lookAtRH(this.m_camPos, this.m_lookAtPos, this.m_up);
    }
    perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number): void {
        
    }
    perspectiveRH(fovy: number, aspect: number, zNear: number, zFar: number): void {        
    }
    perspectiveRH2(fovy: number, pw: number, ph: number, zNear: number, zFar: number): void {        
    }
    getAspect(): number { return this.m_aspect; }
    getViewFieldZoom(): number { return this.m_viewFieldZoom; }
    orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        
    }
    orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        
    }
    isPerspectiveEnabled(): boolean {
        return this.m_perspectiveEnabled;
    }
    isRightHandEnabled(): boolean {
        return this.m_rightHandEnabled;
    }
    setViewXY(px: number, py: number): void {
        if (this.m_unlock) {
            this.m_viewX = px;
            this.m_viewY = py;
        }
    }
    setViewSize(pw: number, ph: number): void {
        if (this.m_unlock) {
            if (pw != this.m_viewW || ph != this.m_viewH) {
                this.m_viewW = pw;
                this.m_viewH = ph;
                this.m_viewHalfW = pw * 0.5;
                this.m_viewHalfH = ph * 0.5;

                //console.log("setViewSize, pw:"+pw+",ph:"+ph);
                if (this.m_perspectiveEnabled) {
                    if (this.m_project2Enabled) {
                        if (this.m_rightHandEnabled) this.perspectiveRH2(this.m_fovy, pw, ph, this.m_zNear, this.m_zFar);
                    }
                    else {
                        if (this.m_rightHandEnabled) this.perspectiveRH(this.m_fovy, pw / ph, this.m_zNear, this.m_zFar);
                        else this.perspectiveLH(this.m_fovy, pw / ph, this.m_zNear, this.m_zFar);
                    }
                }
                else {
                    this.orthoRH(this.m_zNear, this.m_zFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
                }
            }
        }
    }
    getViewX(): number {
        return this.m_viewX;
    }
    getViewY(): number {
        return this.m_viewY;
    }
    getViewWidth(): number {
        return this.m_viewW;
    }
    getViewHeight(): number {
        return this.m_viewH;
    }
    translation(v3: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(v3);
            this.m_lookAtPos.x = v3.x + this.m_lookAtDirec.x;
            this.m_lookAtPos.y = v3.y + this.m_lookAtDirec.y;
            this.m_lookAtPos.z = v3.z + this.m_lookAtDirec.z;
            this.m_changed = true;
        }
    }
    translationXYZ(px: number, py: number, pz: number): void {
        this.m_tempV.setXYZ(px,py,pz);
        if (this.m_unlock && Vector3D.DistanceSquared(this.m_camPos, this.m_tempV) > 0.01) {
            
            this.m_camPos.setTo(px, py, pz);
            this.m_lookAtPos.x = px + this.m_lookAtDirec.x;
            this.m_lookAtPos.y = py + this.m_lookAtDirec.y;
            this.m_lookAtPos.z = pz + this.m_lookAtDirec.z;
            this.m_changed = true;
        }
    }
    forward(dis: number): void {
        if (this.m_unlock) {
            this.m_camPos.x += this.m_lookDirectNV.x * dis;
            this.m_camPos.y += this.m_lookDirectNV.y * dis;
            this.m_camPos.z += this.m_lookDirectNV.z * dis;
            this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
            this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
            this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
            this.m_changed = true;
        }
    }

    forwardFixPos(dis: number, pos: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.x = pos.x + this.m_lookDirectNV.x * dis;
            this.m_camPos.y = pos.y + this.m_lookDirectNV.y * dis;
            this.m_camPos.z = pos.z + this.m_lookDirectNV.z * dis;
            this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
            this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
            this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
            this.m_changed = true;
        }
    }

    setPosition(v3: Vector3D): void {
        if (this.m_unlock) {
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
            var dot = this.m_tempV.dot(this.m_initUP);
            this.m_tempV1.copyFrom(this.m_initUP);
            this.m_tempV1.scaleBy(dot);
            this.m_tempV.subtractBy(this.m_tempV1);
            //m_tempV.y = 0;
            this.m_camPos.copyFrom(v3);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            //
            Vector3D.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_changed = true;
        }
    }
    setPositionXYZ(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
            var dot: number = this.m_tempV.dot(this.m_initUP);
            this.m_tempV1.copyFrom(this.m_initUP);
            this.m_tempV1.scaleBy(dot);
            this.m_tempV.subtractBy(this.m_tempV1);
            this.m_camPos.setTo(px, py, pz);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            //
            Vector3D.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_changed = true;
        }
    }
    setLookPosXYZFixUp(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_lookAtPos.setTo(px, py, pz);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            //
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    setPositionXYZFixUp(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_camPos.setTo(px, py, pz);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            //
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    setPositionFixUp(v3: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(v3);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    copyFrom(tarCam: Camera): void {
        
    }
    private m_tempNV: Vector3D = new Vector3D();
    private m_tempUPV: Vector3D = new Vector3D();
    private m_tempRV: Vector3D = new Vector3D();
    private m_tempCamPos: Vector3D = new Vector3D();
    private m_tempLookAtPos: Vector3D = new Vector3D();
    // view space axis z
    getNV(): Vector3D { this.m_tempNV.copyFrom(this.m_lookDirectNV); return this.m_tempNV;}
    // view space axis y
    getUV(): Vector3D { this.m_tempUPV.copyFrom(this.m_up); return this.m_tempUPV; }
    // view space axis x
    getRV(): Vector3D { this.m_tempRV.copyFrom(this.m_initRV); return this.m_tempRV; }
    getPosition():Vector3D { this.m_tempCamPos.copyFrom(this.m_camPos); return this.m_tempCamPos; }
    getLookAtPosition(): Vector3D { this.m_tempLookAtPos.copyFrom(this.m_lookAtPos); return this.m_tempLookAtPos; }
    setLookAtPosition(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_lookAtPos.setTo(px, py, pz);
            this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_changed = true;
        }
    }
    getPerspectiveEnabled(): boolean { return this.m_perspectiveEnabled; }
    setPerspectiveEnabled(boo: boolean): void { this.m_perspectiveEnabled = boo; }

    private m_rotDegree: number = 0.0;
    private m_rotAxis: Vector3D = new Vector3D();
    private m_rotPivotPoint: Vector3D = null;
    private m_axisRotEnabled: boolean = false;
    appendRotationByAxis(degree: number, axis: Vector3D, pivotPoint: Vector3D = null): void {
        if (this.m_unlock) {
            this.m_rotDegree = degree;
            this.m_changed = true;
            this.m_rotAxis.copyFrom(axis);
            this.m_rotPivotPoint = pivotPoint;
            this.m_axisRotEnabled = true;
        }
    }
    setRotationX(degree: number): void { this.m_rotV.x = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationX(): number { return this.m_rotV.x; }
    setRotationY(degree: number): void { this.m_rotV.y = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationY(): number { return this.m_rotV.y; }
    setRotationZ(degree: number): void { this.m_rotV.z = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationZ() { return this.m_rotV.z; }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        if (this.m_unlock) {
            this.m_rotV.setXYZ(rx,ry,rz);
            this.m_changed = true;
            this.m_axisRotEnabled = false;
        }
    }
    setScaleX(degree: number): void { this.m_scaleV.x = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getScaleX(): number { return this.m_scaleV.x; }
    setScaleY(degree: number): void { this.m_scaleV.y = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getScaleY(): number { return this.m_scaleV.y; }
    setScaleZ(degree: number): void { this.m_scaleV.z = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getScaleZ() { return this.m_scaleV.z; }
    setScaleXYZ(rx: number, ry: number, rz: number): void {
        if (this.m_unlock) {
            this.m_scaleV.setXYZ(rx,ry,rz);
            this.m_changed = true;
            this.m_axisRotEnabled = false;
        }
    }
    screenXYToViewXYZ(px: number, py: number, outV: Vector3D): void {
        px -= this.m_viewX;
        py -= this.m_viewY;
        if (this.m_perspectiveEnabled) {
            px = this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
            py = this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
        }
        outV.setTo(px, py, -this.m_zNear);
        //
    }
    screenXYToWorldXYZ(px: number, py: number, outV: Vector3D): void {
        px -= this.m_viewX;
        py -= this.m_viewY;
        if (this.m_perspectiveEnabled) {
            px = 0.5 * this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
            py = 0.5 * this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
        }
        outV.setTo(px, py, -this.m_zNear);
        outV.w = 1.0;
        //this.m_viewInvertMat.transformVectorSelf(outV);
    }
    getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: Vector3D, ray_tv: Vector3D): void {
        
    }
    calcScreenNormalizeXYByWorldPos(pv3: Vector3D, scPV3: Vector3D): void {
    }
    worldPosToScreen(pv: Vector3D): void {
        
    }
    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值为像素数
    calcViewRectByWorldSphere(pv: Vector3D, radius: number, outV: Vector3D): void {
    }

    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间
    calcScreenRectByWorldSphere(pv: Vector3D, radius: number, outV: Vector3D): void {
        
    }
    getZNear(): number { return this.m_zNear; }
    setZNear(value: number): void { this.m_zNear = value; }
    getZFar(): number { return this.m_zFar; }
    setZFar(value: number): void { this.m_zFar = value; }
    getNearPlaneWidth(): number { return this.m_nearPlaneWidth; }
    setNearPlaneWidth(value: number): void { this.m_nearPlaneWidth = value; }
    getNearPlaneHeight(): number { return this.m_nearPlaneHeight; }
    setNearPlaneHeight(value: number): void { this.m_nearPlaneHeight = value; }
    getFov(): number {
        return this.m_fovy;
    }
    
    getWordFrustumWAABB(): AABB { return this.m_frustumWAABB; }
    getWordFrustumWAABBCenter(): Vector3D { return this.m_frustumWAABB.center; }
    visiTestSphere2(w_cv: Vector3D, radius: number): boolean {
        return true;
    }

    visiTestSphere3(w_cv: Vector3D, radius: number, farROffset: number): boolean {
        return true;
    }
    visiTestPosition(pv: Vector3D): boolean {
        return true;
    }
    visiTestPlane(nv: Vector3D, distance: number): boolean {
        return false;
    }
    // frustum intersect sphere in wrod space
    visiTestSphere(w_cv: Vector3D, radius: number): boolean {

        return true;
    }
    // visibility test
    // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
    // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
    visiTestAABB(ab: AABB): boolean {
        
        return true;
    }
    update(): void {
    }
    updateCamMatToUProbe(uniformProbe: IShaderUniformProbe): void {
       
    }
    destroy(): void {
    }
    lookRHEnabled(): boolean {
        return this.m_lookRHEnabled;
    }
    lookLHEnabled(): boolean {
        return !this.m_lookRHEnabled;
    }
}
export{Camera};