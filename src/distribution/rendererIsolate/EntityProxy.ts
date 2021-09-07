import {Vector3D} from "./Vector3D";
import {EntityObject} from "./EntityObject";

class EntityProxy
{
    static MinV: Vector3D = null;
    static MaxV: Vector3D = null;
    protected m_isAwake:boolean = true;
    lifeTime:number = 0;
    scale:number = 1.0;
    constructor()
    {
    }
    private m_target: any = null;
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
    pv: Vector3D = null;
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
    setTarget(tar:EntityObject):void
    {
        this.m_target = tar;
        tar.getPosition(this.pv);
        this.px = this.pv.x;
        this.py = this.pv.y;
        this.pz = this.pv.z;
    }
    getTarget():EntityObject
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
                if(po_px > EntityProxy.MaxV.x)
                {
                    this.spx *= -1.0;
                    po_px = this.px;
                }
            }
            else
            {
                if(po_px < EntityProxy.MinV.x)
                {
                    this.spx *= -1.0;
                    po_px = this.px;
                }
            }
            if(this.spy > 0.0)
            {
                if(po_py > EntityProxy.MaxV.y)
                {
                    this.spy *= -1.0;
                    po_py = this.py;
                }
            }
            else
            {
                if(po_py < EntityProxy.MinV.y)
                {
                    this.spy *= -1.0;
                    po_py = this.py;
                }
            }
            if(this.spz > 0.0)
            {
                if(po_pz > EntityProxy.MaxV.z)
                {
                    this.spz *= -1.0;
                    po_pz = this.pz;
                }
            }
            else
            {
                if(po_pz < EntityProxy.MinV.z)
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
export {EntityProxy}