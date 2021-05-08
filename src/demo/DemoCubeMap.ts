
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import TextureBlock from "../vox/texture/TextureBlock";
import CameraTrack from "../vox/view/CameraTrack";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";

export namespace demo
{
    export class DemoCubeMap
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_texBlock:TextureBlock;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        initialize():void
        {
            console.log("DemoCubeMap::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(1000.0,1000.0,1000.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer(this.m_renderer);
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

                let urls = [
                    "static/assets/hw_morning/morning_ft.jpg",
                    "static/assets/hw_morning/morning_bk.jpg",
                    "static/assets/hw_morning/morning_up.jpg",
                    "static/assets/hw_morning/morning_dn.jpg",
                    "static/assets/hw_morning/morning_rt.jpg",
                    "static/assets/hw_morning/morning_lf.jpg"
                ];
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let cubeTex0:TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap",urls);
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);

                var plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);

                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.useGourandNormal();
                box.setMaterial(new CubeMapMaterial());
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[cubeTex0]);
                this.m_renderer.addEntity(box);

            }
        }
        run():void
        {
            this.m_statusDisp.update();

            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rcontext.renderBegin();
            this.m_renderer.update();
            this.m_renderer.run();
            this.m_rcontext.runEnd();
            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();
        }
    }
}