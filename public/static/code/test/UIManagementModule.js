
function UIManagementModule() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    this.initialize = function() {
        
        console.log("UIManagementModule::initialize()...");
        
        var VoxCore = window.VoxCore;

        var UILayoutBase = VoxCore.UILayoutBase;
        var Vector3D = VoxCore.Vector3D;
        var Matrix4 = VoxCore.Matrix4;
        var Axis3DEntity = VoxCore.Axis3DEntity;
        var Plane3DEntity = VoxCore.Plane3DEntity;
        var Box3DEntity = VoxCore.Box3DEntity;
        var DisplayEntityContainer = VoxCore.DisplayEntityContainer;

        let uiLayout = UILayoutBase.GetInstance();

        uiLayout.addModule( this );

        m_rotV3 = new Vector3D();

        m_container = new DisplayEntityContainer();
        uiLayout.addToScene(m_container);

        let axis = new Axis3DEntity();
        axis.initialize(300.0);
        uiLayout.addToScene(axis);
        
        let plane = new Plane3DEntity();
        plane.showDoubleFace();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [uiLayout.getImageTexByUrl("static/assets/broken_iron.jpg")]);
        plane.setXYZ(100,0.0,100);
        m_container.addEntity(plane);
        m_plane = plane;
        

        uiLayout.showInfo();
        let vec3 = new Vector3D();
        console.log("vec3: ",vec3);
        let mat4 = new Matrix4();
        console.log("mat4: ",mat4);

    }
    this.run = function() {

        m_plane.getRotationXYZ(m_rotV3);
        m_plane.setRotationXYZ(m_rotV3.x, m_rotV3.y + 1, m_rotV3.z);
        //m_plane.update();
        
        m_container.getRotationXYZ(m_rotV3);
        m_container.setRotationXYZ(m_rotV3.x + 0.5, m_rotV3.y, m_rotV3.z + 1);
        m_container.update();
    }
};
    