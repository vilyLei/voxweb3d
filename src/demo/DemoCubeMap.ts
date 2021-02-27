
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as CubeMapMaterialT from "../vox/material/mcase/CubeMapMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import CubeMapMaterial = CubeMapMaterialT.vox.material.mcase.CubeMapMaterial;

export namespace demo
{
    export class DemoCubeMap
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        initialize():void
        {
            console.log("DemoCubeMap::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                let urls = [
                    "static/assets/hw_morning/morning_ft.jpg",
                    "static/assets/hw_morning/morning_bk.jpg",
                    "static/assets/hw_morning/morning_up.jpg",
                    "static/assets/hw_morning/morning_dn.jpg",
                    "static/assets/hw_morning/morning_rt.jpg",
                    "static/assets/hw_morning/morning_lf.jpg"
                ];
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let cubeTex0:TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap",urls);
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(1000.0,1000.0,1000.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

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