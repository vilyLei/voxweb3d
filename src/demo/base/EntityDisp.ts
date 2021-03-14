
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Billboard3DEntityT from "../../vox/entity/Billboard3DEntity";
import * as ClipsBillboard3DEntityT from "../../vox/entity/ClipsBillboard3DEntity";

import Vector3D = Vector3DT.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import ClipsBillboard3DEntity = ClipsBillboard3DEntityT.vox.entity.ClipsBillboard3DEntity;

export namespace demo
{
    export namespace base
    {
            
        export class EntityDisp
        {
            static MinV:Vector3D = new Vector3D(-1000, -1000, -1000);
            static MaxV:Vector3D = new Vector3D(1000, 1000, 1000);
            protected m_isAwake:boolean = true;
            lifeTime:number = 0;
            scale:number = 1.0;
            constructor()
            {
            }
            private m_target:DisplayEntity = null;
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
            pv:Vector3D = new Vector3D();
            isAwake():boolean
            {
                return this.m_isAwake;
            }
            wake():void
            {
                this.m_isAwake = true;
            }
            sleep():void
            {
                this.m_isAwake = false;
            }
            setTarget(tar:DisplayEntity):void
            {
                this.m_target = tar;
                tar.getPosition(this.pv);
                this.px = this.pv.x;
                this.py = this.pv.y;
                this.pz = this.pv.z;
            }
            getTarget():DisplayEntity
            {
                return this.m_target;
            }
            destroy():void
            {
                this.m_target = null;
            }
            initRandomPos():void
            {
                let mpx:number = Math.random() * 4000 - 2000;
                let mpy:number = Math.random() * 4000 - 2000;
                let mpz:number = Math.random() * 4000 - 2000;
                this.px = mpx;
                this.py = mpy;
                this.pz = mpz;
            }
            update():void
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
                        if(po_px > EntityDisp.MaxV.x)
                        {
                            this.spx *= -1.0;
                            po_px = this.px;
                        }
                    }
                    else
                    {
                        if(po_px < EntityDisp.MinV.x)
                        {
                            this.spx *= -1.0;
                            po_px = this.px;
                        }
                    }
                    if(this.spy > 0.0)
                    {
                        if(po_py > EntityDisp.MaxV.y)
                        {
                            this.spy *= -1.0;
                            po_py = this.py;
                        }
                    }
                    else
                    {
                        if(po_py < EntityDisp.MinV.y)
                        {
                            this.spy *= -1.0;
                            po_py = this.py;
                        }
                    }
                    if(this.spz > 0.0)
                    {
                        if(po_pz > EntityDisp.MaxV.z)
                        {
                            this.spz *= -1.0;
                            po_pz = this.pz;
                        }
                    }
                    else
                    {
                        if(po_pz < EntityDisp.MinV.z)
                        {
                            this.spz *= -1.0;
                            po_pz = this.pz;
                        }
                    }
                    this.px = po_px;
                    this.py = po_py;
                    this.pz = po_pz;
                }
                if(this.synXYZEnabled)
                {
                    this.m_target.setXYZ(this.px, this.py, this.pz);
                }
                this.m_target.setRotationXYZ(this.rx, this.ry, this.rz);
                this.m_target.update();
            }
        }
        export class BillDisp extends EntityDisp
        {
            constructor()
            {
                super();
            }
            private m_bill:Billboard3DEntity = null;
            private m_time:number = Math.random() * 100.0;
            alphaEnabled:boolean = false;
            timeSpd:number = 0.01;
            rotSpd:number = 2.0 * Math.random() - 1.0;
            setBillboard(tar:Billboard3DEntity):void
            {
                this.m_bill = tar;
                super.setTarget(tar);
            }
            
            wake():void
            {
                this.m_bill.setVisible(true);
                super.wake();
            }
            update():void
            {
                if(this.m_isAwake)
                {
                    if(this.lifeTime > 0)
                    {
                        --this.lifeTime;
                        if(this.lifeTime < 1)
                        {
                            this.m_isAwake = false;
                            this.m_bill.setVisible(false);
                        }
                    }
                    let t:number = Math.sin(this.m_time);
                    if(this.alphaEnabled)
                    {
                        this.m_bill.setAlpha(t);
                    }
                    else
                    {
                        this.m_bill.setBrightness(t);
                    }
                    this.m_bill.setRotationZ(this.m_bill.getRotationZ() + this.rotSpd);
                    if(t < 0.0)
                    {
                        t = 0.0;
                    }
                    t = this.scale * (t + 0.1);
                    this.m_bill.setScaleXY(t,t);
                    this.m_time += this.timeSpd;
                    super.update();
                }
            }
        }
        export class ClipsBillDisp extends EntityDisp
        {
            constructor()
            {
                super();
            }
            private m_bill:ClipsBillboard3DEntity = null;
            private m_time:number = Math.random() * 100.0;
            alphaEnabled:boolean = false;
            timeSpd:number = 0.01;
            rotSpd:number = 2.0 * Math.random() - 1.0;
            setBillboard(tar:ClipsBillboard3DEntity):void
            {
                this.m_bill = tar;
                super.setTarget(tar);
            }
            wake():void
            {
                this.m_bill.setVisible(true);
                super.wake();
            }
            update():void
            {
                if(this.m_isAwake)
                {
                    if(this.lifeTime > 0)
                    {
                        --this.lifeTime;
                        if(this.lifeTime < 1)
                        {
                            this.m_isAwake = false;
                            this.m_bill.setVisible(false);
                        }
                    }
                    let t:number = Math.sin(this.m_time);
                    if(this.alphaEnabled)
                    {
                        this.m_bill.setAlpha(t);
                    }
                    else
                    {
                        this.m_bill.setBrightness(t);
                    }
                    this.m_bill.setRotationZ(this.m_bill.getRotationZ() + this.rotSpd);
                    if(t < 0.0)
                    {
                        t = 0.0;
                    }
                    t = this.scale * (t + 0.1);
                    this.m_bill.setScaleXY(t,t);
                    this.m_time += this.timeSpd;
                    super.update();
                }
            }
        }
        export class EntityDispQueue
        {
            private m_list:EntityDisp[] = [];
            constructor()
            {
            }
            getListAt(i:number):EntityDisp
            {
                return this.m_list[i];
            }
            getList():EntityDisp[]
            {
                return this.m_list;
            }
            getListLength():number
            {
                return this.m_list.length;
            }
            setCubeSpaceRange(minV:Vector3D,maxV:Vector3D):void
            {
                EntityDisp.MinV.copyFrom(minV);
                EntityDisp.MaxV.copyFrom(maxV);
            }
            addEntity(tar:DisplayEntity):EntityDisp
            {
                let disp:EntityDisp = new EntityDisp();
                disp.setTarget(tar);
                this.m_list.push(disp);
                return disp;
            }
            addBillEntity(tar:Billboard3DEntity,alphaEnabled:boolean = false):BillDisp
            {
                let disp:BillDisp = new BillDisp();
                disp.setBillboard(tar);
                this.m_list.push(disp);
                return disp;
            }
            addClipsBillEntity(tar:ClipsBillboard3DEntity,alphaEnabled:boolean = false):ClipsBillDisp
            {
                let disp:ClipsBillDisp = new ClipsBillDisp();
                disp.setBillboard(tar);
                this.m_list.push(disp);
                return disp;
            }
            run():void
            {
                let i:number = 0;
                let len:number = this.m_list.length;
                for(; i < len; ++i)
                {
                    this.m_list[i].update();
                }
            }
        }
    }
}