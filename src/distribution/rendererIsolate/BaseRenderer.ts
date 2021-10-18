
import Vector3D from "../../vox/math/Vector3D";

import Color4 from "../../vox/material/Color4";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";

import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import RendererState from "../../vox/render/RendererState";
import RendererDevice from "../../vox/render/RendererDevice";
import {IRenderCamera} from "../../vox/render/IRenderCamera";
//import FBOInstance from "../../vox/scene/FBOInstance";


var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["Vector3D"] = Vector3D;

VoxCore["Color4"] = Color4;
VoxCore["ShaderUniformProbe"] = ShaderUniformProbe;

VoxCore["RendererDevice"] = RendererDevice;
VoxCore["RendererState"] = RendererState;
//VoxCore["FBOInstance"] = FBOInstance;
VoxCore["renderer"] = null;
VoxCore["rendererContext"] = null;

VoxCore["RendererParam"] = RendererParam;
/**
 * A empty Renderer instance example
 */
export class BaseRenderer {
    constructor() { }

    private m_param: RendererParam = null;
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    //private m_axis: Axis3DEntity = null;

    setParam(param: RendererParam): void {
        this.m_param = param;
    }
    getRenderer(): RendererInstance {
        return this.m_renderer;
    }
    getRendererContext(): RendererInstanceContext {
        return this.m_rcontext;
    }
    initialize(pmodule: any): void {
        if(this.m_renderer == null) {
            
            console.log("BaseRenderer::initialize...");
            this.m_renderer = new RendererInstance();
            let camera: IRenderCamera = new pmodule["CameraBase"](this.m_renderer.getRCUid()) as IRenderCamera;
            this.m_renderer.initialize(this.m_param, camera);
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
        /*
        this.m_rcontext.renderBegin();
        
        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        //*/
    }
    getModuleName():string {
        return "baseRenderer";
    }
    getModuleClassName():string {
        return "baseRenderer";
    }
    getRuntimeType():string {
        return "system_running";
    }
}

export default BaseRenderer;