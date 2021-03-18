/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";

import Vector3D = Vector3DT.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;

export namespace voxmotion
{
    export namespace primitive
    {
		export class BoxSpaceMotioner
		{
			rx:number = 0.0;
    		ry:number = 0.0;
    		rz:number = 0.0;
    		px:number = 0.0;
    		py:number = 0.0;
    		pz:number = 0.0;
    		spx:number = Math.random() * 9.0 - 4.5;
    		spy:number = Math.random() * 9.0 - 4.5;
    		spz:number = Math.random() * 9.0 - 4.5;
    		srx:number = Math.random() * 1.0 - 0.5;
    		sry:number = Math.random() * 1.0 - 0.5;
    		srz:number = Math.random() * 1.0 - 0.5;
    		moveEnabled:boolean = true;
			synXYZEnabled:boolean = true;
			private m_awaked:boolean = true;
			private m_target:DisplayEntity = null;
			constructor()
			{
			}
    		initPosition():void
    		{
    		    let mpx = Math.random() * 4000 - 2000;
    		    let mpy = Math.random() * 4000 - 2000;
    		    let mpz = Math.random() * 4000 - 2000;
    		    this.px = mpx;
    		    this.py = mpy;
    		    this.pz = mpz;
    		}
			setTarget(tar:DisplayEntity):void
			{
				this.m_target = tar;
				this.initPosition();
			}
			
    		private m_minV:Vector3D = new Vector3D(-2000, -2000, -2000);
			private m_maxV:Vector3D = new Vector3D(2000, 2000, 2000);
			setMoveRange(minV:Vector3D,maxV:Vector3D):void
			{
				this.m_minV.copyFrom(minV);
				this.m_maxV.copyFrom(maxV);
			}
			getPosition(pv:Vector3D):void
			{
				pv.setXYZ(this.px, this.py, this.pz);
			}
			setPosition(pv:Vector3D):void
			{
				this.px = pv.x;
				this.py = pv.y
				this.pz = pv.z;
			}
			awake():void
			{
				this.m_awaked = true;
			}
			sleep():void
			{
				this.m_awaked = false;
			}
    		update():void
    		{
				if(this.m_awaked)
				{
					this.rx += this.srx;
					this.ry += this.sry;
					this.rz += this.srz;
				
					if(this.moveEnabled)
					{
						let po_px = this.px + this.spx;
						let po_py = this.py + this.spy;
						let po_pz = this.pz + this.spz;
						if(this.spx > 0.0)
						{
							if(po_px > this.m_maxV.x)
							{
								this.spx *= -1.0;
								po_px = this.px;
							}
						}
						else
						{
							if(po_px < this.m_minV.x)
							{
								this.spx *= -1.0;
								po_px = this.px;
							}
						}
						if(this.spy > 0.0)
						{
							if(po_py > this.m_maxV.y)
							{
								this.spy *= -1.0;
								po_py = this.py;
							}
						}
						else
						{
							if(po_py < this.m_minV.y)
							{
								this.spy *= -1.0;
								po_py = this.py;
							}
						}
						if(this.spz > 0.0)
						{
							if(po_pz > this.m_maxV.z)
							{
								this.spz *= -1.0;
								po_pz = this.pz;
							}
						}
						else
						{
							if(po_pz < this.m_minV.z)
							{
								this.spz *= -1.0;
								po_pz = this.pz;
							}
						}
						this.px = po_px;
						this.py = po_py;
						this.pz = po_pz;
					}
					if(this.m_target != null)
					{
						if(this.synXYZEnabled)
						{
							this.m_target.setXYZ(this.px, this.py, this.pz);
						}
						this.m_target.setRotationXYZ(this.rx, this.ry, this.rz);
						this.m_target.update();
					}
				}
    		}
		}
	}
}