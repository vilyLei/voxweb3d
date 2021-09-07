
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import MathConst from "../vox/math/MathConst";
import AABB from "../vox/geom/AABB";

import Sphere from "../vox/geom/Sphere";
import Plane from "../vox/geom/Plane";
import RadialLine from "../vox/geom/RadialLine";
import LineSegment from "../vox/geom/LineSegment";
import StraightLine from "../vox/geom/StraightLine";

import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import CameraBase from "../vox/view/CameraBase";
import RendererState from "../vox/render/RendererState";
import RendererDevice from "../vox/render/RendererDevice";


var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["Vector3D"] = Vector3D;
VoxCore["AABB"] = AABB;
VoxCore["Vector3D"] = Vector3D;
VoxCore["Matrix4"] = Matrix4;
VoxCore["MathConst"] = MathConst;

VoxCore["Sphere"] = Sphere;
VoxCore["Plane"] = Plane;
VoxCore["RadialLine"] = RadialLine;
VoxCore["LineSegment"] = LineSegment;
VoxCore["StraightLine"] = StraightLine;

VoxCore["RendererDevice"] = RendererDevice;
VoxCore["RendererState"] = RendererState;
VoxCore["CameraBase"] = CameraBase;

VoxCore["renderer"] = null;
VoxCore["rendererContext"] = null;

/**
 * A empty Renderer instance example
 */
export class DemoBaseRenderer {
    constructor() { }

    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    //private m_axis: Axis3DEntity = null;

    getRenderer(): RendererInstance {
        return this.m_renderer;
    }
    getRendererContext(): RendererInstanceContext {
        return this.m_rcontext;
    }
    initialize(): void {
        if(this.m_renderer == null) {

            console.log("DemoBaseRenderer::initialize...");
    
            this.m_renderer = new RendererInstance();
            this.m_renderer.initialize();
            this.m_renderer.appendProcess();
            this.m_renderer.appendProcess();
            this.m_renderer.appendProcess();
            
            this.m_rcontext = this.m_renderer.getRendererContext();
    
            VoxCore["renderer"] = this.m_renderer;
            VoxCore["rendererContext"] = this.m_rcontext;
            /*
            let axis = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_renderer.addEntity(axis);
            this.m_axis = axis;
            
            let tex = new ImageTextureProxy(64, 64);
            
            let pl = new Plane3DEntity();
            //plane.initializeXOZSquare(400.0);
            //this.m_renderer.addEntity(plane);
            let img: HTMLImageElement = new Image();
            img.onload = (evt: any): void => {
                console.log("PlayerOne::initialize() image loaded",img.src);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                tex.setDataFromImage(img);                
                pl.initializeXOZSquare(500.0, [tex]);
                this.m_renderer.addEntity(pl);
            }
            img.src = "static/assets/yanj.jpg";
            //*/
        }
        
    }
    //private m_yAngle: number = 0;
    run(): void {

        //this.m_yAngle += 1.0;
        //this.m_axis.setRotationXYZ(0.0, this.m_yAngle, 0.0);
        //this.m_axis.update();

        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
    }
}

export default DemoBaseRenderer;