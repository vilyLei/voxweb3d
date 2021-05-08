
import MouseEvent from "../../vox/event/MouseEvent";
import Color4 from "../../vox/material/Color4";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

export default class ColorRectImgButton extends Plane3DEntity
{
    constructor()
    {
        super();
    }
    index:number = 0;
    overColor:Color4 = new Color4(1.0,0.5,1.1,1.0);
    downColor:Color4 = new Color4(1.0,0.0,1.0,1.0);
    outColor:Color4 = new Color4(1.0,1.0,1.0,1.0);
    private m_dispatcher:MouseEvt3DDispatcher = null;
    private m_width:number = 100.0;
    private m_height:number = 100.0;
    private m_posZ:number = 0.0;
    
    setAlpha(pa:number):void
    {
        this.overColor.a = pa;
        this.downColor.a = pa;
        this.outColor.a = pa;
    }
    getWidth():number
    {
        return this.m_width;
    }
    getHeight():number
    {
        return this.m_height;
    }
    private initEvtBase():void
    {
        this.m_dispatcher = new MouseEvt3DDispatcher();
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
        this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
        //this.m_dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
        this.setEvtDispatcher(this.m_dispatcher);
    }
    initialize(startX:number,startY:number,pwidth:number,pheight:number,texList:TextureProxy[] = null):void
    {
        if(this.m_dispatcher == null)
        {
            this.m_width = pwidth;
            this.m_height = pheight;
            this.initEvtBase();
            super.initializeXOY(startX,startY,pwidth,pheight,texList);
            this.mouseEnabled = true;
            let material:any = this.getMaterial();
            material.setRGBA4f(this.outColor.r,this.outColor.g,this.outColor.b,this.outColor.a);
        }
    }
    setXY(px:number,py:number):void
    {
        super.setXYZ(px,py,this.m_posZ);
        this.update();
    }
    setXYZ(px:number,py:number,pz:number):void
    {
        this.m_posZ = pz;
        super.setXYZ(px,py,pz);
        this.update();
    }
    
    addEventListener(type:number,listener:any,func:(evt:any)=>void):void
    {
        if(this.m_dispatcher != null)
        {
            this.m_dispatcher.addEventListener(type,listener,func);
        }
    }            
    removeEventListener(type:number,listener:any,func:(evt:any)=>void):void
    {
        if(this.m_dispatcher != null)
        {
            this.m_dispatcher.removeEventListener(type,listener,func);
        }
    }
    //protected mouseMoveListener(evt:any):void
    //{
    //    //console.log(this.name+", mouseMoveListener mouse over. this.disp != null: "+(this.disp != null));
    //    
    //}
    protected mouseOverListener(evt:any):void
    {
        let material:any = this.getMaterial();
        material.setRGBA4f(this.overColor.r,this.overColor.g,this.overColor.b,this.overColor.a);
    }
    protected mouseOutListener(evt:any):void
    {
        let material:any = this.getMaterial();
        material.setRGBA4f(this.outColor.r,this.outColor.g,this.outColor.b,this.outColor.a);
    }
    protected mouseDownListener(evt:any):void
    {
        let material:any = this.getMaterial();
        material.setRGBA4f(this.downColor.r,this.downColor.g,this.downColor.b,this.downColor.a);
    }
    protected mouseUpListener(evt:any):void
    {
        let material:any = this.getMaterial();
        material.setRGBA4f(this.overColor.r,this.overColor.g,this.overColor.b,this.overColor.a);
    }
    destory():void
    {
        super.destroy();
    }
    toString():string
    {
        return "[ColorRectImgButton]";
    }
}