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
import {CampType,CampFindMode} from "../../../app/robot/camp/Camp";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import RendererScene from "../../../vox/scene/RendererScene";
import EruptionEffectPool from "../../../particle/effect/EruptionEffectPool";

export default class RedCamp implements IRoleCamp
{
    private m_rsc:RendererScene = null;
    private m_roles:IAttackDst[] = [];
    private m_freeRoles:IAttackDst[] = [];
    private m_tempV0:Vector3D = new Vector3D();
    private m_eff0Pool:EruptionEffectPool = null;
    distance:number = 0.0;
    constructor()
    {
    }
    initialize(rsc:RendererScene):void
    {
        if(this.m_rsc == null)
        {
            this.m_rsc = rsc;

            if(this.m_eff0Pool == null)
            {
                //  let texFlame:TextureProxy = this.m_textures[8];//"static/assets/testEFT4.jpg"
                //  let texSolid:TextureProxy = this.m_textures[3];
                this.m_eff0Pool = new EruptionEffectPool();
                this.m_eff0Pool.timeSpeed = 15.0;
                this.m_eff0Pool.initialize(this.m_rsc,1, 60,50,
                    AssetsModule.GetImageTexByUrl("static/assets/testEFT4.jpg"),
                    AssetsModule.GetImageTexByUrl("static/assets/stones_02.png"),
                    true);
                //  this.m_eff0Pool.createEffect(null);
            }
        }
    }
    addRole(role:IAttackDst):void
    {
        if(role != null)this.m_roles.push(role);
    }
    private m_rsn:IAttackDst = null;
    private m_rsnList:IAttackDst[] = new Array(128);
    private sorting(low:number,high:number):number
    {
        let arr:IAttackDst[] = this.m_rsnList;
        //标记位置为待排序数组段的low处也就时枢轴值
        this.m_rsn = arr[low];                
        while(low < high)
        {
            //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
            while(low < high && arr[high].attackDis >= this.m_rsn.attackDis)
            {
                --high;
            }
            // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
            arr[low] = arr[high];                    
            while(low < high && arr[low].attackDis <= this.m_rsn.attackDis)
            {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = this.m_rsn;                
        return low;
    }
    private snsort(low:number,high:number):void
    {
        if(low < high)
        {
            let pos:number = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }
    testAttDst(pos:Vector3D, radius:number,findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number = -1):IAttackDst
    {
        //if(srcCampType == CampType.Red)
        //{
        let list:IAttackDst[] = this.m_roles;
        let len:number = list.length;
        if(len > 0)
        {
            let i:number = 0;
            let role:IAttackDst = null;
            let dis:number;
            for(; i < len; ++i)
            {
                role = list[i];
                if(role.campType != srcCampType && role.lifeTime > 0)
                {
                    dis = radius + role.radius;
                    dis *= dis;
                    this.m_tempV0.subVecsTo(pos, role.position);
                    this.distance = this.m_tempV0.getLengthSquared();
                    if(dis >= this.distance)
                    {
                        // 判断视野之内是否能看到
                        if(fov > 0)
                        {
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
    testSpecAttDst(role:IAttackDst, pos:Vector3D, radius:number,findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number = -1):IAttackDst
    {
        if(role.lifeTime > 0)
        {
            let dis:number = radius + role.radius;
            dis *= dis;
            this.m_tempV0.subVecsTo(pos, role.position);
            this.distance = this.m_tempV0.getLengthSquared();
            if(dis >= this.distance)
            {
                // 判断视野之内是否能看到
                if(fov > 0)
                {
                }
                role.attackDis = Math.sqrt(this.distance);
                return role;
            }
        }
        return null;
    }
    findAttDst(pos:Vector3D, radius:number,findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number = -1):IAttackDst
    {
        let list:IAttackDst[] = this.m_roles;
        let len:number = list.length;
        if(len > 0)
        {
            let i:number = 0;
            let role:IAttackDst = null;
            let rsnLen:number = 0;
            let dis:number;
            for(; i < len; ++i)
            {
                role = list[i];
                if(role.lifeTime > 0)
                {
                    if(role.campType != srcCampType)
                    {
                        dis = radius + role.radius;
                        dis *= dis;
                        this.m_tempV0.subVecsTo(pos, role.position);
                        this.distance = this.m_tempV0.getLengthSquared();
                        if(dis >= this.distance)
                        {
                            // 判断视野之内是否能看到
                            if(fov > 0)
                            {
                            }
                            role.attackDis = Math.sqrt(this.distance);
                            this.m_rsnList[rsnLen] = role;
                            rsnLen++;
                        }
                    }
                }
                else
                {
                    //console.log("del a role, because of its life time value is less 0.");
                    role.getDestroyedPos(this.m_tempV0);
                    this.m_eff0Pool.createEffect(this.m_tempV0);
                    //m_tempV0
                    list.splice(i,1);
                    i --;
                    len --;
                    this.m_freeRoles.push(role);
                    role.setVisible(false);
                }
            }
            if(rsnLen > 1)
            {
                this.snsort(0,rsnLen-1);
            }
            if(rsnLen > 0)
            {
                this.distance = this.m_rsnList[0].attackDis;
                return this.m_rsnList[0];
            }
        }
        return null;
    }
    run():void
    {
        this.m_eff0Pool.run();
    }
    destroy()
    {
        this.m_rsnList.fill(null);
    }
}