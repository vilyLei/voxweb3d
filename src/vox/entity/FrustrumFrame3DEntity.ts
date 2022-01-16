/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from '../../vox/math/Vector3D';
import DashedLineMesh from '../../vox/mesh/DashedLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';
import Color4 from '../material/Color4';
import {IRenderCamera} from "../../vox/render/IRenderCamera";

export default class FrustrumFrame3DEntity extends DisplayEntity
{
    private m_currMaterial:Line3DMaterial = null;
    constructor()
    {
        super();
    }
    private m_posarr:number[] = null;
    private m_colorarr:number[] = null;

    setRGB3f(pr:number,pg:number,pb:number)
    {
        this.m_currMaterial.setRGB3f(pr,pg,pb);
    }
    createMaterial():void
    {
        if(this.getMaterial() == null)
        {
            this.m_currMaterial = new Line3DMaterial(false);
            this.setMaterial(this.m_currMaterial);
        }
    }
    protected __activeMesh(material:MaterialBase):void
    {
        if(this.getMesh() == null)
        {
            let mesh:DashedLineMesh = new DashedLineMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat( material.getBufSortFormat() );
            mesh.initialize(this.m_posarr, this.m_colorarr);
            this.setMesh(mesh);
        }
    }
    private m_ids: number[] = [
        0,1,1,2,2,3,3,0,    // far plane
        4,5,5,6,6,7,7,4,    // near plane
        0,4,1,5,2,6,3,7,    // side plane
    ];
    initiazlize(camera:IRenderCamera, farColor: Color4 = null, nearColor: Color4 = null, sideDownColor: Color4 = null, sideUpColor: Color4 = null): void {
        
        let pvs:Vector3D[] = camera.getWordFrustumVtxArr();
        if(this.m_posarr == null)this.m_posarr = new Array(72);
        if(this.m_colorarr == null)this.m_colorarr = new Array(72);

        let ids:number[] = this.m_ids;
        if(farColor == null) farColor = new Color4(1.0,0.0,1.0,1.0);
        if(nearColor == null) nearColor = new Color4(0.0,0.5,1.0);
        if(sideDownColor == null) sideDownColor = new Color4(0.0,0.9,0.0);
        if(sideUpColor == null) sideUpColor = new Color4(0.0,0.9,0.9);
        let colors: Color4[] = [
            farColor,farColor,farColor,farColor,        farColor,farColor,farColor,farColor,
            nearColor,nearColor,nearColor,nearColor,    nearColor,nearColor,nearColor,nearColor,
            sideDownColor,sideDownColor,sideDownColor,sideDownColor,    sideUpColor,sideUpColor,sideUpColor,sideUpColor,
        ];
        let pv: Vector3D;
        let color: Color4;
        let j: number = 0;
        for(let i: number = 0; i < ids.length; i++) {

            pv = pvs[ ids[i] ];
            color = colors[ i ];

            this.m_posarr[j    ] = pv.x;
            this.m_posarr[j + 1] = pv.y;
            this.m_posarr[j + 2] = pv.z;

            this.m_colorarr[j    ] = color.r;
            this.m_colorarr[j + 1] = color.g;
            this.m_colorarr[j + 2] = color.b;
            
            j += 3;
        }
        this.createMaterial();
        this.activeDisplay();
    }
    private m_cameraVersion: number = -1;
    private m_camera: IRenderCamera = null;
    updateFrame(camera:IRenderCamera): boolean {
        if(this.m_camera != camera) {
            this.m_camera = camera;
            this.m_cameraVersion = -1;
        }
        if(camera != null && this.m_cameraVersion != camera.version) {
            this.m_cameraVersion = camera.version;
            let mesh:DashedLineMesh = this.getMesh() as DashedLineMesh;
            if(mesh != null) {
                let pvs:Vector3D[] = camera.getWordFrustumVtxArr();    
                let ids:number[] = this.m_ids;
                let pv: Vector3D;
                for(let i: number = 0; i < ids.length; i++) {
                    pv = pvs[ ids[i] ];    
                    mesh.setVSXYZAt(i, pv.x,pv.y,pv.z);
                }
                return true;
            }
        }
        return false;
    }
    destroy(): void {
        this.m_camera = null;
    }
    toString():string
    {
        return "FrustrumFrame3DEntity(name="+this.name+",uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
    }
}