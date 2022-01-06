/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import Vector3D from "../../../vox/math/Vector3D";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import { CampRoleStatus, CampType, CampFindMode } from "../../../app/robot/camp/Camp";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import RendererScene from "../../../vox/scene/RendererScene";
import EruptionEffectPool from "../../../particle/effect/EruptionEffectPool";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";

class CampRoleManager {
    private m_statusList: number[] = [0, 0, 0, 0, 0, 0];
    private m_campTeamsTotal: number = 0;
    constructor() { }

    private updateStatus(role: IAttackDst, flag: number): void {
        let i: number = 0;
        switch (role.campType) {
            case CampType.Green:
                i = 1;
                break;
            case CampType.Red:
                i = 2;
                break;
            case CampType.Blue:
                i = 3;
                break;
            default:
                i = 0;
                break;
        }
        this.m_statusList[i] += flag;
    }
    addRole(role: IAttackDst): void {
        this.updateStatus(role, 1);
        this.calcCampTeamsTotal();
    }
    removeRole(role: IAttackDst): void {
        this.updateStatus(role, -1);
        this.calcCampTeamsTotal();
    }
    private calcCampTeamsTotal(): void {
        this.m_campTeamsTotal = 0;
        for (let i: number = 0; i < 6; ++i) {
            this.m_campTeamsTotal += this.m_statusList[i] > 0 ? 1 : 0;
        }
    }
    getCampTeamsTotal(): number {
        return this.m_campTeamsTotal;
    }
    reset(): void {
        for (let i: number = 0; i < 6; ++i) {
            this.m_statusList[i] = 0;
        }
        this.m_campTeamsTotal = 0;
    }
}
export default class RedCamp implements IRoleCamp {

    private m_rsc: RendererScene = null;
    private m_roles: IAttackDst[] = [];
    private m_freeRoles: IAttackDst[] = [];
    private m_blackRoles: IAttackDst[] = [];
    private m_blackTimeList: number[] = [];
    private m_tempV0: Vector3D = new Vector3D();
    private m_eff0Pool: EruptionEffectPool = null;
    readonly roleManager: CampRoleManager = new CampRoleManager();
    effectRenderProcessIndex: number = 4;
    distance: number = 0.0;
    constructor() {
    }
    getFreeRoles(): IAttackDst[] {
        return this.m_freeRoles;
    }
    reviveRole(total: number): void {
        let roles = this.m_freeRoles;
        let len: number = roles.length;
        if(len > total) {
            len = total;
        }
        for (let i: number = 0; i < len; ++i) {
            const role = roles[i];
            role.lifeTime = 100 + Math.round(300.0 * Math.random());
            role.setVisible(true);
            if(role.campType != CampType.Free) {
                const flag = role.lifeTime % 3;
                switch (flag) {
                    case 1:
                        role.campType = CampType.Red;
                        break;
                    case 2:
                        role.campType = CampType.Green;
                        break;
                    default:
                        role.campType = CampType.Blue;
                        break;
                }
            }
            role.wake();
            this.addRole( role );
            roles.splice(i, 1);
            i--;
            len--;

        }
    }
    initialize(rsc: RendererScene): void {
        if (this.m_rsc == null) {
            this.m_rsc = rsc;

            if (this.m_eff0Pool == null) {
                this.m_eff0Pool = new EruptionEffectPool();
                
                this.m_eff0Pool.solidRN = 4;
                this.m_eff0Pool.solidCN = 8
                this.m_eff0Pool.depthOffset = AssetsModule.GetInstance().particleGroupDepthOffset;
                this.m_eff0Pool.materialPipeline = AssetsModule.GetMaterialPipeline();
                this.m_eff0Pool.pipeTypes = [MaterialPipeType.FOG_EXP2];
                this.m_eff0Pool.gravityFactor = -1.8;
                this.m_eff0Pool.timeSpeed = 15.0;
                this.m_eff0Pool.solidPremultiplyAlpha = true;
                this.m_eff0Pool.solidColor.setRGB3f(0.3,0.3,0.3);
                this.m_eff0Pool.initialize(this.m_rsc, this.effectRenderProcessIndex, 60, 50,
                    AssetsModule.GetImageTexByUrl("static/assets/testEFT4.jpg"),
                    //AssetsModule.GetImageTexByUrl("static/assets/stones_02.png"),
                    //AssetsModule.GetImageTexByUrl("static/assets/stones_01.png"),
                    //AssetsModule.GetImageTexByUrl("static/assets/stones_05.png"),
                    AssetsModule.GetImageTexByUrl("static/assets/stones_06.png"),
                    true);
                //  this.m_eff0Pool.createEffect(null);
            }
        }
    }
    addRole(role: IAttackDst): void {
        if (role != null && role.status == CampRoleStatus.Free) {
            role.status = CampRoleStatus.Busy;
            this.m_roles.push(role);
            this.roleManager.addRole(role);
        }
    }
    private m_rsn: IAttackDst = null;
    private m_rsnList: IAttackDst[] = new Array(128);
    private sorting(low: number, high: number): number {
        let arr: IAttackDst[] = this.m_rsnList;
        //标记位置为待排序数组段的low处也就时枢轴值
        this.m_rsn = arr[low];
        while (low < high) {
            //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
            while (low < high && arr[high].attackDis >= this.m_rsn.attackDis) {
                --high;
            }
            // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
            arr[low] = arr[high];
            while (low < high && arr[low].attackDis <= this.m_rsn.attackDis) {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = this.m_rsn;
        return low;
    }
    private snsort(low: number, high: number): void {
        if (low < high) {
            let pos: number = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }
    testAttDst(pos: Vector3D, radius: number, findMode: CampFindMode, srcCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {
        //if(srcCampType == CampType.Red)
        //{
        let list: IAttackDst[] = this.m_roles;
        let len: number = list.length;
        if (len > 0) {
            let i: number = 0;
            let role: IAttackDst = null;
            let dis: number;
            for (; i < len; ++i) {
                role = list[i];
                if (role.campType != srcCampType && role.lifeTime > 0) {
                    dis = radius + role.radius;
                    dis *= dis;
                    this.m_tempV0.subVecsTo(pos, role.position);
                    this.distance = this.m_tempV0.getLengthSquared();
                    if (dis >= this.distance) {
                        // 判断视野之内是否能看到
                        if (fov > 0) {
                        }
                        role.attackDis = Math.sqrt(this.distance);
                        return role;
                    }
                }
            }
        }
        //}
        return null;
    }
    testSpecAttDst(role: IAttackDst, pos: Vector3D, radius: number, findMode: CampFindMode, srcCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {
        if (role.lifeTime > 0) {
            let dis: number = radius + role.radius;
            dis *= dis;
            this.m_tempV0.subVecsTo(pos, role.position);
            this.distance = this.m_tempV0.getLengthSquared();
            if (dis >= this.distance) {
                // 判断视野之内是否能看到
                if (fov > 0) {
                }
                role.attackDis = Math.sqrt(this.distance);
                return role;
            }
        }
        return null;
    }
    findAttDst(pos: Vector3D, radius: number, findMode: CampFindMode, srcCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {

        let list = this.m_roles;
        let len = list.length;
        if (len > 0) {

            let role: IAttackDst = null;
            let rsnLen: number = 0;
            let dis: number;
            for (let i: number = 0; i < len; ++i) {
                role = list[i];
                if (role.lifeTime > 0) {
                    if (role.campType != srcCampType) {
                        dis = radius + role.radius;
                        dis *= dis;
                        this.m_tempV0.subVecsTo(pos, role.position);
                        this.distance = this.m_tempV0.getLengthSquared();
                        if (dis >= this.distance) {
                            // 判断视野之内是否能看到
                            if (fov > 0) {
                            }
                            role.attackDis = Math.sqrt(this.distance);
                            this.m_rsnList[rsnLen] = role;
                            rsnLen++;
                        }
                    }
                }
                else {
                    //console.log("del a role, because of its life time value is less 0.");
                    role.getDestroyedPos(this.m_tempV0);
                    this.m_eff0Pool.createEffect(this.m_tempV0);
                    //m_tempV0
                    list.splice(i, 1);
                    i--;
                    len--;
                    this.m_blackRoles.push(role);
                    this.m_blackTimeList.push(8);
                }
            }
            if (rsnLen > 1) {
                this.snsort(0, rsnLen - 1);
            }
            if (rsnLen > 0) {
                this.distance = this.m_rsnList[0].attackDis;
                return this.m_rsnList[0];
            }
        }
        return null;
    }
    private m_revivingDelay: number = 100;
    run(): void {
        if(this.roleManager.getCampTeamsTotal() < 2) {
            if(this.m_revivingDelay < 1) {
                this.m_revivingDelay = 100;
                let tot: number = Math.round( Math.random() * 20 + 20 );
                this.reviveRole( tot );
            }
            else {
                this.m_revivingDelay --;
            }
        }
        let list: IAttackDst[] = this.m_blackRoles;
        let len: number = list.length;
        if (len > 0) {
            let timeList: number[] = this.m_blackTimeList;
            for (let i: number = 0; i < len; ++i) {
                timeList[i]--;
                if (timeList[i] < 1) {
                    this.roleManager.removeRole(list[i]);
                    list[i].status = CampRoleStatus.Free;
                    this.m_freeRoles.push(list[i]);
                    list[i].setVisible(false);
                    list.splice(i, 1);
                    timeList.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        this.m_eff0Pool.run();
    }
    destroy() {
        this.m_rsnList.fill(null);
    }
}