
//import Vector3D from "../../../vox/math/Vector3D";
import Stage3D from "../../../vox/display/Stage3D";
import RendererScene from "../../../vox/scene/RendererScene";

import TextureProxy from "../../../vox/texture/TextureProxy";
import MaterialBase from "../../../vox/material/MaterialBase";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import * as TexManagerT from "./TexManager";
import * as MaterialParamT from "./MaterialParam";
//import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import * as ParalMap2MaterialT from "../mateiral/ParalMap2Material";
import * as WetWoodMaterialT from "../mateiral/WetWoodMaterial";
import * as DirtyIronMaterialT from "../mateiral/DirtyIronMaterial";

////import Vector3D = Vector3DT.vox.math.Vector3D;
//import Stage3D = Stage3DT.vox.display.Stage3D;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;

//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import TexManager = TexManagerT.voxvat.demo.scene.TexManager;
import MaterialParam = MaterialParamT.voxvat.demo.scene.MaterialParam;
////import Default3DMaterial = Default3DMaterialT.vox.material.mcase.Default3DMaterial;
import ParalMap2Material = ParalMap2MaterialT.voxvat.demo.material.ParalMap2Material;
import WetWoodMaterial = WetWoodMaterialT.voxvat.demo.material.WetWoodMaterial;
import DirtyIronMaterial = DirtyIronMaterialT.voxvat.demo.material.DirtyIronMaterial;

export namespace voxvat
{
    export namespace demo
    {
        export namespace scene
        {
            export class MaterialManager
            {
                constructor()
                {
                }
                private static s_rsc:RendererScene = null;
                private static s_stage3D:Stage3D = null;
                private static s_selectTarget:DisplayEntity = null;
                private static s_targetParam:MaterialParam = null;
                private static s_materialList:MaterialBase[] = [null,null,null,null,null,null,null,null,null,null,null,null];
                static SetDispTarget(selectTarget:DisplayEntity):void
                {
                    MaterialManager.s_selectTarget = selectTarget;
                }
                static GetDispTarget():DisplayEntity
                {
                    return MaterialManager.s_selectTarget;
                }
                static SetMaterialParam(pm:MaterialParam):void
                {
                    MaterialManager.s_targetParam = pm;
                }
                static SetDispMaterial(m:MaterialBase):void
                {
                    if(m != null && MaterialManager.s_selectTarget != null)
                    {
                        let entity:DisplayEntity = MaterialManager.s_selectTarget;
                        let dispM:MaterialBase = entity.getMaterial() as MaterialBase;
                        if(dispM != null)
                        {
                            MaterialManager.s_rsc.removeEntity(entity);
                            entity.setMaterial(m);
                            MaterialManager.s_rsc.addEntity(entity);
                        }
                    }
                }
                static CreateMaterialAt(i:number,param:MaterialParam):MaterialBase
                {
                    let m:MaterialBase;
                    switch(i)
                    {
                        case 0:
                            let pm:ParalMap2Material = new ParalMap2Material();
                            pm.initData();
                            if(param != null)pm.setUVScale(param.uscale,param.vscale);
                            m = pm;
                        break;
                        case 1:
                            //m = new Default3DMaterial();
                            let dm:DirtyIronMaterial = new DirtyIronMaterial();
                            dm.initData();
                            if(param != null)dm.setUVScale(param.uscale,param.vscale);
                            m = dm;
                        break;
                        case 2:
                            let wm:WetWoodMaterial = new WetWoodMaterial();
                            wm.initData();
                            if(param != null)wm.setUVScale(param.uscale,param.vscale);
                            m = wm;
                        break;
                        default:
                            break;
                    }
                    if(m != null)
                    {
                        m.initializeByCodeBuf(true);
                        MaterialManager.s_materialList[i] = m;
                    }
                    return m;
                }
                
                static CreateTexListAt(i:number):TextureProxy[]
                {
                    switch(i)
                    {
                        case 0:
                            return [
                                    TexManager.CreateTexByUrl("static/voxgl/assets/yanj.jpg"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/disp/yanj_OCC.png"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/disp/yanj_NRM.png"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/moss_04.jpg"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/image_003_1.jpg")
                                ];
                        break;
                        case 1:
                            return [
                                TexManager.CreateTexByUrl("static/voxgl/assets/grayMask_01.jpg"),
                                TexManager.CreateTexByUrl("static/voxgl/assets/broken_iron.jpg"),
                                TexManager.CreateTexByUrl("static/voxgl/assets/broken_iron.jpg"),
                                TexManager.CreateTexByUrl("static/voxgl/assets/metal_02.jpg")
                            ];
                        break;
                        case 2:
                            return [
                                    TexManager.CreateTexByUrl("static/voxgl/assets/grayMask_06.jpg"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/broken_iron.jpg"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/image_003_1.jpg"),
                                    TexManager.CreateTexByUrl("static/voxgl/assets/box_wood01.jpg")
                                ];
                        break;
                        default:
                            break;
                    }
                    return null;
                }
                static SetDispMaterialAt(i:number):void
                {
                    if(MaterialManager.s_selectTarget != null)
                    {
                        let pm:MaterialBase = MaterialManager.s_selectTarget.getMaterial() as MaterialBase;
                        let m:MaterialBase;
                        
                        if(MaterialManager.s_materialList[i].getShdUniqueName() != pm.getShdUniqueName())
                        {
                            let param:MaterialParam = MaterialManager.s_targetParam;
                            m = MaterialManager.CreateMaterialAt(i,param);
                            if(m != null)
                            {
                                m.setTextureList(MaterialManager.CreateTexListAt(i));
                                m.initializeByCodeBuf(true);
                                MaterialManager.SetDispMaterial(m);
                            }
                        }

                    }
                }
                static Initialize(rscene:RendererScene):void
                {
                    MaterialManager.s_rsc = rscene;
                    MaterialManager.s_stage3D = rscene.getStage3D() as Stage3D;
                    for(let i:number = 0; i < 3; ++i)
                    {
                        MaterialManager.CreateMaterialAt(i,null);
                    }
                }
            }
        }
    }
}