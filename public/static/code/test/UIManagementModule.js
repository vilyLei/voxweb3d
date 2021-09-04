
function UIManagementModule() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;
    
    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_btnPX = 102.0;
    let m_btnPY = 10.0;
    let m_btns = [];

    this.initialize = function() {
        
        console.log("UIManagementModule::initialize()...");
        
        VoxCore = window.VoxCore;

        var UILayoutBase = VoxCore.UILayoutBase;
        var Vector3D = VoxCore.Vector3D;
        var Matrix4 = VoxCore.Matrix4;
        var Axis3DEntity = VoxCore.Axis3DEntity;
        var Plane3DEntity = VoxCore.Plane3DEntity;
        var Box3DEntity = VoxCore.Box3DEntity;
        var DisplayEntityContainer = VoxCore.DisplayEntityContainer;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();
        
        if (uiLayout.isMobileWeb()) {
            m_btnSize = 64;
            m_btnPX = 280;
            m_btnPY = 30;
        }
        if(uiLayout.isWebGL1()) {
            m_btnPX += 32;
        }

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

        let absort = this.createSelectBtn("absorb", "absorb", "ON", "OFF", false);
        //uiLayout.addToScene(absort);

    }
    
    this.createSelectBtn = function(ns, uuid, selectNS, deselectNS, flag, visibleAlways) {

        if(visibleAlways == undefined) {
            visibleAlways = false;
        }

        let selectBar = new VoxCore.SelectionBar();
        selectBar.uuid = uuid;
        ///selectBar.testTex = this.getImageTexByUrl("static/assets/testEFT4.jpg");
        selectBar.initialize(m_ruisc, ns, selectNS, deselectNS, m_btnSize);
        selectBar.addEventListener(VoxCore.SelectionEvent.SELECT, this, this.selectChange);
        if (flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(m_btnPX, m_btnPY);
        m_btnPY += m_btnSize + 1;
        if (!visibleAlways) m_btns.push(selectBar);
        return selectBar;
    }
    this.createProgressBtn = function(ns, uuid, progress, visibleAlways) {

        if(visibleAlways == undefined) {
            visibleAlways = false;
        }
        let proBar = new VoxCore.ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(m_ruisc, ns, m_btnSize, this.m_bgLength);
        proBar.setProgress(progress, false);
        proBar.addEventListener(VoxCore.ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(m_btnPX, m_btnPY);
        m_btnPY += m_btnSize + 1;
        if (!visibleAlways) m_btns.push(proBar);
        return proBar;
    }

    this.createValueBtn = function(ns, uuid, value, minValue, maxValue, visibleAlways) {

        if(visibleAlways == undefined) {
            visibleAlways = false;
        }
        let proBar = new VoxCore.ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(m_ruisc, ns, m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue(value, false);

        proBar.addEventListener(VoxCore.ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(m_btnPX, m_btnPY);
        m_btnPY += m_btnSize + 1;
        if (!visibleAlways) m_btns.push(proBar);
        return proBar;
    }
    this.selectChange = function(evt) {

        console.log("UIManagementModule::selectChange()...");
    }
    this.progressChange = function(evt) {

        console.log("UIManagementModule::progressChange()...");
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
    