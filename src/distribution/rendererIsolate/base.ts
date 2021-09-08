
interface Vector3D {
    x: number;
    y: number;
    z: number;
    copyFrom(v3: Vector3D): void;
    subtractBy(v3: Vector3D): void;
    addBy(v3: Vector3D): void;
}

interface EntityObject {
    setRotationXYZ(rx: number, ry: number, rz: number):void;
    setScaleXYZ(sx: number, sy: number, sz: number):void;
    getPosition(pv: any): void;
    update():void;
}
interface Renderer {
    addEntity(entity:EntityObject, index: number): void;
}

class EntityDisp
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
export {Vector3D, EntityObject, Renderer, EntityDisp}