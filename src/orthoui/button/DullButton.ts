/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Color4 from "../../vox/material/Color4";

export default class DullButton extends Plane3DEntity
{
    constructor()
    {
        super();
    }
    index:number = 0;
    private m_dispatcher:MouseEvt3DDispatcher = null;
    private m_width:number = 100.0;
    private m_height:number = 100.0;
    private m_posZ:number = 0.0;
    
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
        }
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        
        //console.log("ColorTextImgButton::mouseOverListener().");
        let material:any = this.getMaterial();
        material.setRGB3f(pr,pg,pb);
    }
    setRGBColor(color: Color4): void {
        
        //console.log("ColorTextImgButton::mouseOverListener().");
        let material:any = this.getMaterial();
        material.setRGB3f(color.r, color.g, color.b);
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
    destory():void
    {
        super.destroy();
    }
    toString():string
    {
        return "[ColorRectImgButton]";
    }
}