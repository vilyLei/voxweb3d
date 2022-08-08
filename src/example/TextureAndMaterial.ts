
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import { IRendererInstanceContext } from "../vox/scene/IRendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import * as BaseTextureMaterialT from "./material/base/BaseTextureMaterial";


//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import BaseTextureMaterial = BaseTextureMaterialT.example.material.base.BaseTextureMaterial;

export namespace example
{
    export class TextureAndMaterial
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:IRendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = true;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("TextureAndMaterial::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                //RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                
                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize();

                let planeMaterial:BaseTextureMaterial = new BaseTextureMaterial();
                //planeMaterial.setRGB3f(Math.random(), Math.random(),Math.random());
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(planeMaterial);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_rscene.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let boxMaterial:BaseTextureMaterial = new BaseTextureMaterial();
                //boxMaterial.setRGB3f(Math.random(), Math.random(),Math.random());
                let box:Box3DEntity = new Box3DEntity();
                box.setMaterial(boxMaterial);
                plane.setMaterial(planeMaterial);
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);

            }
        }
        run():void
        {
            // show fps status
            this.m_statusDisp.update();

            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            // render begin
            this.m_rscene.runBegin();

            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();
            // render end
            this.m_rscene.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}