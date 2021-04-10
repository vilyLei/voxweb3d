/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as IParticleEffectT from "../../particle/effect/IParticleEffect";
import * as IRendererT from "../../vox/scene/IRenderer";

import Vector3D = Vector3DT.vox.math.Vector3D;
import IParticleEffect = IParticleEffectT.particle.effect.IParticleEffect;
import IRenderer = IRendererT.vox.scene.IRenderer;

export namespace particle
{
    export namespace effect
    {
        export class ParticleEffectPool
        {
            protected m_effList:IParticleEffect[] = [];
            protected m_freeEffList:IParticleEffect[] = [];
            protected m_renderer:IRenderer = null;
            protected m_renderProcessI:number = 0;
            constructor(){}

            createEffect(pv:Vector3D):void
            {

            }
            isRunningEmpty():boolean
            {
                return this.m_effList.length < 1;
            }
            run():void
            {
                let list:IParticleEffect[] = this.m_effList;
                let len:number = list.length;
                let i:number = 0;
                let eff:IParticleEffect;
                for(; i < len; ++i)
                {
                    eff = list[i];
                    //console.log("eff.isAwake():",eff.isAwake());
                    if(eff.isAwake())
                    {
                        eff.updateTime(6.0);
                    }
                    else
                    {
                        eff.setVisible(false);
                        list.splice(i,1);
                        i--;
                        len--;
                        this.m_freeEffList.push(eff);
                    }
                }
            }
        }
    }
}