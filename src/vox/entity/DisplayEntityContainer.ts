/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 独立，且使用 DisplayEntityContainer 、transform 等等机制的容器

import MathConst from "../../vox/math/MathConst";
import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import Vector3D from "../../vox/math/Vector3D";
import IAABB from "../../vox/geom/IAABB";
import AABB from "../../vox/geom/AABB";
import Matrix4 from "../../vox/math/Matrix4";
import Matrix4Pool from "../../vox/math/Matrix4Pool";
import IEntityTransform from "../../vox/entity/IEntityTransform";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
// import ITransformEntity from "../../vox/entity/ITransformEntity";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IRenderer from "../../vox/scene/IRenderer";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IROTransform from "../../vox/display/IROTransform";


export default class DisplayEntityContainer implements IDisplayEntityContainer, IEntityTransform {
    private static s_uid = 0;
    private m_uid = 0;
    protected m_eventDispatcher: IEvtDispatcher = null;
    constructor(boundsEnabled: boolean = true) {
        if (boundsEnabled) {
            this.createBounds();
        }
        this.m_uid = DisplayEntityContainer.s_uid++;
    }
    private m_transformStatus = 0;
    private m_rotateBoo = false;
    // It is a flag that need inverted mat yes or no
    private m_invMatEnabled = false;
    private m_invLocMatEnabled = false;
    private m_oMatEnabled = false;
    private m_pos = new Vector3D();
    private m_visible = true;
    private m_parentVisible = true;

    protected m_globalBounds: IAABB = null;
    protected m_gboundsStatus = -1;
    /**
     * entity global bounds version list
     */
    protected m_ebvers: number[] = null;
    /**
     * child container global bounds version list
     */
    protected m_cbvers: number[] = null;
    private m_$updateBounds = true;
    // 自身所在的world的唯一id, 通过这个id可以找到对应的world
    __$wuid: number = -1;
    // render process uid
    wprocuid: number = -1;
    // 自身在world中被分配的唯一id, 通过这个id就能在world中快速找到自己所在的数组位置
    __$weid: number = -1;
    // 记录自身是否再容器中(取值为0和1), 不允许外外面其他代码调用
    __$contId: number = 0;
    // 父级, 不允许外面其他代码调用
    private __$parent: DisplayEntityContainer = null;
    private __$renderer: IRenderer = null;
    uuid = "";
    // mouse interaction enabled
    mouseEnabled: boolean = false;
    private m_entities: ITransformEntity[] = [];
    private m_entitiesTotal: number = 0;
    private m_children: DisplayEntityContainer[] = [];
    private m_childrenTotal: number = 0;

    __$setRenderer(renderer: IRenderer): void {
        let i: number = 0;
        if (this.__$renderer != null) {
            if (renderer == null) {
                // remove all entities from container
                //console.log("remove all entities from container, this.m_entitiesTotal: "+this.m_entitiesTotal);
                for (; i < this.m_entitiesTotal; ++i) {
                    this.__$renderer.removeEntity(this.m_entities[i]);
                }
            }
            this.__$renderer = renderer;
        }
        else {
            this.__$renderer = renderer;
            if (renderer != null) {
                // add all entities
                // console.log("add all entities from container, this.m_entitiesTotal: "+this.m_entitiesTotal+", this.wprocuid: "+this.wprocuid);
                for (; i < this.m_entitiesTotal; ++i) {
                    this.m_entities[i].__$rseFlag = RSEntityFlag.RemoveContainerFlag(this.m_entities[i].__$rseFlag);
                    this.__$renderer.addEntity(this.m_entities[i], this.wprocuid, false);
                    this.m_entities[i].__$rseFlag = RSEntityFlag.AddContainerFlag(this.m_entities[i].__$rseFlag);
                }
            }
        }
        for (i = 0; i < this.m_childrenTotal; ++i) {
            this.m_children[i].wprocuid = this.wprocuid;
            this.m_children[i].__$setRenderer(renderer);
        }
    }
    __$setParent(parent: DisplayEntityContainer): void {
        if (parent != this && parent != this.__$parent) {
            this.m_$updateBounds = true;
            this.__$parent = parent;
            if (parent != null) {
                this.wprocuid = parent.wprocuid;
                this.m_parentVisible = parent.__$getParentVisible() && parent.getVisible();
                this.__$setRenderer(parent.__$renderer);
            }
            else {
                this.__$setRenderer(null);
            }
            this.__$setParentMatrix(parent);
        }
    }
    getRenderer(): IRenderer {
        return this.__$renderer;
    }
    getParent(): DisplayEntityContainer {
        return this.__$parent;
    }
    
    getTransform(): IROTransform {
        return null;
    }
    
    dispatchEvt(evt: any): number {
        
        // if (evt.getClassType() == MouseEvent.EventClassType) {
        if (this.m_eventDispatcher != null) {
            return this.m_eventDispatcher.dispatchEvt(evt);
        }
        // }
        return 0;
    }
    getEvtDispatcher(evtClassType: number): IEvtDispatcher {
        return this.m_eventDispatcher;
    }
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void {
        this.m_eventDispatcher = evtDisptacher;
    }
    protected createBounds(): void {
        if (this.m_globalBounds == null) {
            this.m_globalBounds = new AABB();
            this.m_ebvers = [];
            this.m_cbvers = [];
        }
    }
    getGlobalBounds(): IAABB {
        return this.m_globalBounds;
    }
    getLocalBounds(): IAABB {
        return null;
    }
    getGlobalBoundsVer(): number {
        if (this.m_globalBounds != null) {
            return this.m_globalBounds.version;
        }
        return -1;
    }
    addChild(child: DisplayEntityContainer): void {
        if (child != null && child.__$wuid < 0 && child.__$contId < 1) {
            let i: number = 0;
            for (; i < this.m_childrenTotal; ++i) {
                if (this.m_children[i] == child) {
                    return;
                }
            }
            if (i >= this.m_childrenTotal) {
                if (this.m_cbvers != null) {
                    this.m_cbvers.push(-1);
                }
                child.__$contId = 1;
                child.wprocuid = this.wprocuid;
                child.__$setParent(this);
                this.m_children.push(child);
                this.m_childrenTotal++;
            }
        }
    }
    removeChild(child: DisplayEntityContainer): void {
        if (child != null && child.getParent() == this) {
            let i: number = 0;
            for (; i < this.m_childrenTotal; ++i) {
                if (this.m_children[i] == child) {
                    child.__$contId = 0;
                    child.wprocuid = -1;
                    child.__$setParent(null);
                    this.m_children.splice(i, 1);
                    if (this.m_cbvers != null) {
                        this.m_cbvers.slice(i, 1);
                    }
                    --this.m_childrenTotal;
                    break;
                }
            }
        }
    }
    removeChildByUid(uid: number): void {
        if (uid > -1) {
            let i: number = 0;
            for (; i < this.m_childrenTotal; ++i) {
                if (this.m_children[i].getUid() == uid) {
                    this.m_children[i].__$contId = 0;
                    this.m_children.splice(i, 1);
                    if (this.m_cbvers != null) {
                        this.m_cbvers.slice(i, 1);
                    }
                    --this.m_childrenTotal;
                    break;
                }
            }
        }
    }
    getChildAt(i: number): DisplayEntityContainer {
        if (i >= 0 && i < this.m_childrenTotal) {
            return this.m_children[i];
        }
        return null;
    }
    getChildByUid(uid: number): ITransformEntity {
        if (uid > -1) {
            let i: number = 0;
            for (; i < this.m_entitiesTotal; ++i) {
                if (this.m_entities[i].getUid() == uid) {
                    return this.m_entities[i];
                }
            }
        }
        return null;
    }
    getChildrenTotal(): number {
        return this.m_childrenTotal;
    }
    addEntity(entity: ITransformEntity): void {
        if (entity.getMesh() == null) {
            throw Error("Error: entity.getMesh() == null.");
        }
        //console.log("container addEntity entity");
        //if(entity.__$wuid < 0 && entity.__$contId < 1)
        if (entity.__$testContainerEnabled()) {
            let i: number = 0;
            for (; i < this.m_entitiesTotal; ++i) {
                if (this.m_entities[i] == entity) {
                    return;
                }
            }
            if (i >= this.m_entitiesTotal) {
                this.m_entities.push(entity);
                this.m_entitiesTotal++;
                if (this.m_ebvers != null) {
                    this.m_ebvers.push(-1);
                }
                entity.getTransform().setParentMatrix(this.getMatrix());
                if (this.__$renderer != null) {
                    //entity.__$contId = 0;
                    entity.__$rseFlag = RSEntityFlag.RemoveContainerFlag(entity.__$rseFlag);
                    this.__$renderer.addEntity(this.m_entities[i], this.wprocuid, false);
                }
                entity.__$rseFlag = RSEntityFlag.AddContainerFlag(entity.__$rseFlag);
                entity.__$setParent(this);
                entity.update();
            }
        }
    }
    removeEntity(entity: ITransformEntity): void {
        if (entity != null && entity.__$getParent() == this) {
            let i: number = 0;
            for (; i < this.m_entitiesTotal; ++i) {
                if (this.m_entities[i] == entity) {
                    entity.__$rseFlag = RSEntityFlag.RemoveContainerFlag(entity.__$rseFlag);
                    this.m_entities[i].__$setParent(null);
                    this.m_entities.splice(i, 1);
                    if (this.m_ebvers != null) {
                        this.m_ebvers.slice(i, 1);
                    }
                    --this.m_entitiesTotal;
                    if (this.__$renderer != null) {
                        this.__$renderer.removeEntity(entity);
                    }
                    break;
                }
            }
        }
    }
    removeEntityByUid(uid: number): void {
        if (uid > -1) {
            let i: number = 0;
            for (; i < this.m_entitiesTotal; ++i) {
                if (this.m_entities[i].getUid() == uid) {
                    this.m_entities[i].__$rseFlag = RSEntityFlag.RemoveContainerFlag(this.m_entities[i].__$rseFlag);
                    this.m_entities[i].__$setParent(null);
                    if (this.__$renderer != null) {
                        this.__$renderer.removeEntity(this.m_entities[i]);
                    }
                    this.m_entities.splice(i, 1);
                    if (this.m_ebvers != null) {
                        this.m_ebvers.slice(i, 1);
                    }
                    --this.m_entitiesTotal;
                    break;
                }
            }
        }
    }
    getEntityAt(i: number): ITransformEntity {
        if (i >= 0 && i < this.m_entitiesTotal) {
            return this.m_entities[i];
        }
        return null;
    }
    getEntities(): ITransformEntity[] {
        
        let entities: ITransformEntity[] = null;
        if (this.m_entities != null) {
            entities = this.m_entities.slice(0);
        }
        for(let i: number = 0; i < this.m_children.length; ++i) {
            let list = this.m_children[i].getEntities();
            if(list != null) {
                entities = entities.concat( list );
            }
        }
        return entities;
    }
    getEntityByUid(uid: number): ITransformEntity {
        if (uid > -1) {
            let i: number = 0;
            for (; i < this.m_entitiesTotal; ++i) {
                if (this.m_entities[i].getUid() == uid) {
                    return this.m_entities[i];
                }
            }
        }
        return null;
    }
    getEntitysTotal(): number {
        return this.m_entitiesTotal;
    }
    sphereIntersect(centerV: Vector3D, radius: number): boolean {
        return false;
    }
    __$getParentVisible(): boolean {
        return this.m_parentVisible;
    }
    __$updateVisible(): void {
        if (this.__$parent != null) {
            this.m_parentVisible = this.__$parent.__$getParentVisible() && this.__$parent.getVisible();
        }
        let i: number = 0;
        //console.log("this.m_visible: "+this.m_visible+", this.m_parentVisible: "+this.m_parentVisible);
        let boo: boolean = this.m_visible && this.m_parentVisible;
        for (; i < this.m_entitiesTotal; ++i) {
            this.m_entities[i].__$setDrawEnabled(boo);
        }
        for (i = 0; i < this.m_childrenTotal; ++i) {
            this.m_children[i].__$updateVisible();
        }
    }
    setVisible(boo: boolean): void {
        this.m_visible = boo;
        this.__$updateVisible();
    }
    getVisible(): boolean {
        return this.m_visible;
    }
    isVisible(): boolean {
        return this.m_visible;
    }
    getREType(): number {
        return 12;
    }
    getUid(): number { return this.m_uid; }
    getX(): number { return this.m_pos.x; }
    getY(): number { return this.m_pos.y; }
    getZ(): number { return this.m_pos.z; }
    setX(p: number): void { this.m_pos.x = p; this.m_transformStatus |= 1; }
    setY(p: number): void { this.m_pos.y = p; this.m_transformStatus |= 1; }
    setZ(p: number): void { this.m_pos.z = p; this.m_transformStatus |= 1; }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_pos.x = px;
        this.m_pos.y = py;
        this.m_pos.z = pz;
        this.m_transformStatus |= 1;
    }
    offsetPosition(pv: Vector3D): void {
        this.m_pos.x += pv.x;
        this.m_pos.y += pv.y;
        this.m_pos.z += pv.z;
        this.m_transformStatus |= 1;
    }
    setPosition(pv: Vector3D): void {
        this.m_pos.x = pv.x;
        this.m_pos.y = pv.y;
        this.m_pos.z = pv.z;
        this.m_transformStatus |= 1;
    }
    getPosition(pv: Vector3D = null): Vector3D {
        if(!pv) pv = new Vector3D();
        pv.copyFrom( this.m_pos );
        return pv;
    }
    private m_rx: number = 0;
    private m_ry: number = 0;
    private m_rz: number = 0;
    getRotationX(): number { return this.m_rx; }
    getRotationY(): number { return this.m_ry; }
    getRotationZ(): number { return this.m_rz; }
    setRotationX(degrees: number): void { this.m_rx = degrees; this.m_transformStatus |= 2; this.m_rotateBoo = true; }
    setRotationY(degrees: number): void { this.m_ry = degrees; this.m_transformStatus |= 2; this.m_rotateBoo = true; }
    setRotationZ(degrees: number): void { this.m_rz = degrees; this.m_transformStatus |= 2; this.m_rotateBoo = true; }
    
    setRotation3(r: Vector3D): void {
        this.m_rx = r.x; this.m_transformStatus |= 2; this.m_rotateBoo = true;
        this.m_ry = r.y;
        this.m_rz = r.z;
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_rx = rx;
        this.m_ry = ry;
        this.m_rz = rz;
        this.m_transformStatus |= 2;
        this.m_rotateBoo = true;
    }
    private m_sx: number = 1.0;
    private m_sy: number = 1.0;
    private m_sz: number = 1.0;
    getScaleX(): number { return this.m_sx; }
    getScaleY(): number { return this.m_sy; }
    getScaleZ(): number { return this.m_sz; }
    setScaleX(p: number): void { this.m_sx = p; this.m_transformStatus |= 2; }
    setScaleY(p: number): void { this.m_sy = p; this.m_transformStatus |= 2; }
    setScaleZ(p: number): void { this.m_sz = p; this.m_transformStatus |= 2; }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_sx = sx;
        this.m_sy = sy;
        this.m_sz = sz;
        this.m_transformStatus |= 2;
    }
    setScale3(sv: Vector3D): void {
        this.setScaleXYZ(sv.x, sv.y, sv.z);
    }
    setScaleXY(sx: number, sy: number): void {        
        this.setScaleXYZ(sx, sy, this.m_sz);
    }
    setScale(s: number): void {
        this.setScaleXYZ(s, s, s);
    }

    getRotationXYZ(pv: Vector3D): Vector3D {
        if(!pv) pv = new Vector3D();
        pv.setXYZ(this.m_rx, this.m_ry, this.m_rz);
        return pv;
    }
    getScaleXYZ(pv: Vector3D): Vector3D {
        if(!pv) pv = new Vector3D();
        pv.setXYZ(this.m_sx, this.m_sy, this.m_sz);
        return pv;
    }
    // local matrix
    private m_localMat: Matrix4 = Matrix4Pool.GetMatrix();
    private m_invLocalMat: Matrix4 = null;
    // local to world spcae matrix
    private m_omat: Matrix4 = null;
    // word to local matrix
    private m_invOmat: Matrix4 = null;
    private m_parentMat: Matrix4 = null;
    localToParent(pv: Vector3D): void {
        this.m_localMat.transformVectorSelf(pv);
    }
    parentToLocal(pv: Vector3D): void {
        if (this.m_invLocalMat != null) {
            if (this.m_invLocMatEnabled) {
                this.m_invLocMatEnabled = false;
                this.m_invLocalMat.copyFrom(this.m_localMat);
            }
        }
        else {
            this.m_localMat = Matrix4Pool.GetMatrix();
            this.m_invLocMatEnabled = false;
        }
        this.m_invLocalMat.transformVectorSelf(pv);
    }
    localToGlobal(pv: Vector3D): void {
        this.getMatrix().transformVectorSelf(pv);
    }
    globalToLocal(pv: Vector3D): void {
        this.getInvMatrix().transformVectorSelf(pv);
    }
    getInvMatrix(): Matrix4 {
        if (this.m_invOmat != null) {
            if (this.m_invMatEnabled) {
                this.m_invOmat.copyFrom(this.getMatrix());
                this.m_invOmat.invert();
                this.m_invMatEnabled = false;
            }
        }
        else {
            this.m_invOmat = Matrix4Pool.GetMatrix();
            this.m_invOmat.copyFrom(this.getMatrix());
            this.m_invOmat.invert();
        }
        this.m_invMatEnabled = false;
        return this.m_invOmat;
    }
    getLocalMatrix(): Matrix4 {
        return this.m_localMat;
    }
    // local to world matrix
    getMatrix(): Matrix4 {
        if (this.m_parentMat != null) {
            if (this.m_oMatEnabled) {
                this.m_omat.copyFrom(this.m_localMat);
                this.m_omat.append(this.m_parentMat);
                this.m_oMatEnabled = false;
            }
            return this.m_omat;
        }
        else {
            this.m_oMatEnabled = false;
            return this.m_localMat;
        }
    }
    __$setParentMatrix(parent: DisplayEntityContainer): void {
        this.m_parentMat = parent.getMatrix();
        if (this.m_parentMat != null) {
            if (this.m_omat == null) {
                this.m_omat = Matrix4Pool.GetMatrix();
            }
        }
        this.m_transformStatus |= 2;
        //this.update();    
        let i: number = 0;
        for (; i < this.m_childrenTotal; ++i) {
            this.m_children[i].__$setParentMatrix(this);
        }
    }
    private __$updateBoundsDo(): void {
        let i: number = 0;
        if (this.m_$updateBounds) {
            this.m_$updateBounds = false;
            if (this.m_globalBounds != null) {
                this.m_globalBounds.reset();
                let bounds: IAABB = null;
                for (; i < this.m_entitiesTotal; ++i) {
                    bounds = this.m_entities[i].getGlobalBounds();
                    if (bounds != null) {
                        this.m_globalBounds.union(bounds);
                    }
                    this.m_ebvers[i] != this.m_entities[i].getGlobalBoundsVer();
                }
                for (i = 0; i < this.m_childrenTotal; ++i) {
                    this.m_children[i].__$updateBoundsDo();
                    bounds = this.m_children[i].getGlobalBounds();
                    if (bounds != null) {
                        this.m_globalBounds.union(bounds);
                    }
                    this.m_cbvers[i] != this.m_children[i].getGlobalBoundsVer();
                }
                this.m_globalBounds.update();
            }
        }
        else {
            for (i = 0; i < this.m_childrenTotal; ++i) {
                this.m_children[i].__$updateBoundsDo();
            }
        }
    }
    protected __$updateBounds(): void {
        this.m_$updateBounds = true;
    }
    protected updateBounds(): void {

        if (this.m_globalBounds != null && this.m_gboundsStatus > 0) {
            
            let i: number = 0;
            if (this.m_gboundsStatus < 2) {
                // 表示父级和子集的global bounds都要发生变化
                for (; i < this.m_childrenTotal; ++i) {
                    this.m_children[i].updateBounds();
                }
            }
            this.m_globalBounds.reset();
            i = 0;
            let bounds: IAABB = null;
            for (; i < this.m_entitiesTotal; ++i) {
                bounds = this.m_entities[i].getGlobalBounds();
                if (bounds != null) {
                    this.m_globalBounds.union(bounds);
                }
                this.m_ebvers[i] = this.m_entities[i].getGlobalBoundsVer();
            }
            for (i = 0; i < this.m_childrenTotal; ++i) {
                bounds = this.m_children[i].getGlobalBounds();
                if (bounds != null) {
                    this.m_globalBounds.union(bounds);
                }
                this.m_cbvers[i] = this.m_children[i].getGlobalBoundsVer();
            }
            this.m_globalBounds.update();
            if (this.__$parent != null) {
                // 只需要父级执行bounds尺寸范围的调节
                let parent: DisplayEntityContainer = this.__$parent;
                while (parent != null) {
                    parent.__$updateBounds();
                    parent = parent.getParent();
                }
            }
            this.m_gboundsStatus = -1;
        }
    }
    update(): void {
        if (this.m_localMat != null) {
            if (this.m_transformStatus > 0) {
                this.m_localMat.identity();
                if (this.m_rotateBoo) {
                    this.m_localMat.setScaleXYZ(this.m_sx, this.m_sy, this.m_sz);
                    this.m_localMat.setRotationEulerAngle(this.m_rx * MathConst.MATH_PI_OVER_180, this.m_ry * MathConst.MATH_PI_OVER_180, this.m_rz * MathConst.MATH_PI_OVER_180);
                    this.m_localMat.setTranslation(this.m_pos);
                }
                else {
                    this.m_localMat.setScaleXYZ(this.m_sx, this.m_sy, this.m_sz);
                    this.m_localMat.setTranslation(this.m_pos);
                }
                this.m_invMatEnabled = true;
                this.m_oMatEnabled = true;
                this.m_invLocMatEnabled = true;
                // 把平移与旋转缩放分开，是不是能增加效能?
                this.m_transformStatus = 0;
                //console.log("DisplayEntityContainer::update(), this: "+this);
                //console.log("DisplayEntityContainer::update(), this.getMatrix(): "+this.getMatrix().toString());
                //console.log("this.m_entitiesTotal: "+this.m_entitiesTotal+", this: "+this);
                let i: number = 0;
                for (; i < this.m_entitiesTotal; ++i) {
                    //console.log("this.m_entities["+i+"].getTransform().");
                    this.m_entities[i].getTransform().setParentMatrix(this.getMatrix());
                    //if(this.m_entities[i].__$wuid > -1)this.m_entities[i].update();
                    this.m_entities[i].update();
                }
                // 重构自己的AABB
                // 通知子集自己的 transform信息变了
                for (i = 0; i < this.m_childrenTotal; ++i) {
                    this.m_children[i].__$setParentMatrix(this);
                    this.m_children[i].update();
                }
                // 依次通知父级一些信息, 例如aabb需要重新计算, 注意，这里可能因为上面的几步操作子级和父级相互循环调用，出现堆栈溢出
                // 容器本身不需要localBounds
                // bounds变化的诱因: a.自身的transform发生变化(可能这个变化来自于父级的transform变化);b.包含的entity发生了transform变换或者mesh数据变换;
                // c.子类出现了a或者b的情况
                // m_gboundsStatus 为1, 表示容器自身发生了tansform变化因此自身的子集需要做global bounds的变化, 而父级的bounds需要做对应的重新计算而不要影响到子集
                this.m_gboundsStatus = 1;
            }
            else {
                // 这样的话会导致这里每帧都会被执行
                this.m_gboundsStatus = -1;
                let i: number = 0;
                if (this.m_entitiesTotal > 0) {
                    for (; i < this.m_entitiesTotal; ++i) {
                        this.m_entities[i].update();
                        if (this.m_ebvers[i] != this.m_entities[i].getGlobalBoundsVer()) {
                            this.m_gboundsStatus = 2;
                        }
                    }
                }
                // 如果 m_gboundsStatus 为2, 则表示自身的 bounds 因为自身的 entity 的bounds变化,父级的bounds需要做对应的重新计算而不要影响到子集
                if (this.m_childrenTotal > 0) {
                    for (i = 0; i < this.m_childrenTotal; ++i) {
                        this.m_children[i].update();
                        if (this.m_cbvers[i] != this.m_children[i].getGlobalBoundsVer()) {
                            this.m_gboundsStatus = 2;
                            //break;
                        }
                    }
                }
                // 如果 m_gboundsStatus 为2, 则表示子容器的 bounds 发生了变化, 父级的bounds需要做对应的重新计算而不要影响到子集
            }
            this.updateBounds();
            this.__$updateBoundsDo();
        }
    }
    //// local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
    destroy(): void {
        // 当自身被完全移出RenderWorld之后才能执行自身的destroy
        if (this.__$wuid < 0) {
            if (this.m_eventDispatcher != null) {
                this.m_eventDispatcher.destroy();
                this.m_eventDispatcher = null;
            }
            if (this.m_omat != null && this.m_omat != this.m_localMat) Matrix4Pool.RetrieveMatrix(this.m_omat);
            if (this.m_invOmat != null) Matrix4Pool.RetrieveMatrix(this.m_invOmat);
            if (this.m_localMat != null) Matrix4Pool.RetrieveMatrix(this.m_localMat);
            if (this.m_invLocalMat != null) Matrix4Pool.RetrieveMatrix(this.m_invLocalMat);
            this.m_localMat = null;
            this.m_invLocalMat = null;
            this.m_invOmat = null;
            this.m_parentMat = null;
            this.m_omat = null;
        }
    }
    toString(): string {
        return "[DisplayEntityContainer(uid = " + this.m_uid + ", __$wuid = " + this.__$wuid + ", __$weid = " + this.__$weid + ")]";
    }
}