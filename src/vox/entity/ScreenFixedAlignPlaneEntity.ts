/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import ScreenFixedPlaneMaterial from "../../vox/material/mcase/ScreenFixedPlaneMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import SpaceCullingMask from "../../vox/space/SpaceCullingMask";

export default class ScreenFixedAlignPlaneEntity extends DisplayEntity
{
    private m_startX:number = 0;
    private m_startZ:number = 0;
    private m_pwidth:number = 0;
    private m_plong:number = 0;
    private m_flag:number = 0;
    private m_currMaterial:ScreenFixedPlaneMaterial = null;
    flipVerticalUV:boolean = false;
    constructor()
    {
        super();
    }
    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_currMaterial.setRGB3f(pr,pg,pb);
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_currMaterial.setRGBA4f(pr,pg,pb,pa);
    }
    createMaterial(texList:TextureProxy[]):void
    {
        if(this.getMaterial() == null)
        {
            this.m_currMaterial = new ScreenFixedPlaneMaterial();
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else
        {
            this.getMaterial().setTextureList(texList);
        }
    }
    showDoubleFace():void
    {
        this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
    }
    initialize(startX:number,startY:number,pwidth:number,pheight:number,texList:TextureProxy[] = null):void
    {
        this.m_startX = startX;
        this.m_startZ = startY;
        this.m_pwidth = pwidth;
        this.m_plong = pheight;
        this.m_flag = 0;
        this.spaceCullMask = SpaceCullingMask.NONE;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material:MaterialBase)
    {
        if(this.getMesh() == null)
        {
            let mesh:RectPlaneMesh = new RectPlaneMesh();
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.axisFlag = 0;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_startX,this.m_startZ,this.m_pwidth,this.m_plong);
            this.setMesh(mesh);
        }
    }
    
    destroy():void
    {
        super.destroy();
        this.m_currMaterial = null;
    }
    toString():string
    {
        return "[ScreenFixedAlignPlaneEntity]";
    }
}