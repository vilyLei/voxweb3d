
//import {Matrix4} from "./Matrix4";

var Matrix4: any;
class Engine{

    static MathConst: any;
    static Vector3D: any;
    static Matrix4: any;
    static Camera: any;
    static Plane3DEntity: any;
    static ImageTextureProxy: any;
    static Axis3DEntity: any;
    static Box3DEntity: any;
    static Sphere3DEntity: any;

    static Initialize(pmodule: any): void {

        Engine.ImageTextureProxy = pmodule.ImageTextureProxy;
            
        Engine.Plane3DEntity = pmodule.Plane3DEntity;
        Engine.Axis3DEntity = pmodule.Axis3DEntity;
        Engine.Sphere3DEntity = pmodule.Sphere3DEntity;
        Engine.MathConst = pmodule.MathConst;
        Engine.Vector3D = pmodule.Vector3D;
        Engine.Matrix4 = pmodule.Matrix4;
        Engine.Camera = pmodule.CameraBase;


        Matrix4 = Engine.Matrix4;
    }
}
export {Matrix4, Engine};