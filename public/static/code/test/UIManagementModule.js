
function UIManagementModule() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;

    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_btnPX = 162.0;
    let m_btnPY = 70.0;
    let m_btns = [];

    function initLoadJS(module_ns) {

        let pwindwo = window;

        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", "static/code/test/"+module_ns+".js", true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            console.log("progress, e: ", e);
            //document.body.innerText = Math.round(100.0 * e.loaded / e.total) + "%";
        };

        codeLoader.onload = function () {

            console.log("js code file load success.....");
            let scriptEle = document.createElement("script");

            scriptEle.onerror = (e) => {
                console.log("script onerror, e: ", e);
            }

            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);

            if (pwindwo[module_ns] != null) {
                let noduleIns = new pwindwo[module_ns]();
                noduleIns.initialize();
            }
        }
        codeLoader.send(null);
    }
    this.initialize = function () {

        console.log("UIManagementModule::initialize()...");

        VoxCore = window["VoxCore"];

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
            m_btnSize *= 2;
            m_btnPX *= 2;
            m_btnPY *= 2;
        }

        uiLayout.addModule(this);

        m_rotV3 = new Vector3D();

        m_container = new DisplayEntityContainer();
        uiLayout.addToScene(m_container);

        //  let axis = new Axis3DEntity();
        //  axis.initialize(300.0);
        //  uiLayout.addToScene(axis);


        let plane = new Plane3DEntity();
        plane.name = "plane";
        plane.showDoubleFace();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [uiLayout.getImageTexByUrl("static/assets/broken_iron.jpg")]);
        plane.setXYZ(100, 0.0, 100);
        m_container.addEntity(plane);
        uiLayout.saveEntity( plane );
        m_plane = plane;


        uiLayout.showInfo();
        let vec3 = new Vector3D();
        console.log("vec3: ", vec3);
        let mat4 = new Matrix4();
        console.log("mat4: ", mat4);

        let playCtrBtn = this.createSelectBtn("播放控制代码块", "playCtr", "已加载", "加载", false);
        let btn = playCtrBtn.nameButton;
        btn.outColor.setRGBA4f(1.0,1.0,0.0,0.8);
        btn.updateColor();
        
        let colorSelectBtn = this.createSelectBtn("颜色控制代码块", "colorSelect", "已加载", "加载", false);
        btn = colorSelectBtn.nameButton;
        btn.outColor.setRGBA4f(1.0,1.0,0.0,0.8);
        btn.updateColor();
    }

    this.createSelectBtn = function (ns, uuid, selectNS, deselectNS, flag, visibleAlways) {

        if (visibleAlways == undefined) {
            visibleAlways = false;
        }

        let selectBar = new VoxCore.SelectionBar();
        selectBar.uuid = uuid;
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
    this.createProgressBtn = function (ns, uuid, progress, visibleAlways) {

        if (visibleAlways == undefined) {
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

    this.createValueBtn = function (ns, uuid, value, minValue, maxValue, visibleAlways) {

        if (visibleAlways == undefined) {
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
    this.selectChange = function (evt) {

        console.log("UIManagementModule::selectChange()..., evt.uuid: ",evt.uuid, evt.target);
        switch(evt.uuid) {
            case "playCtr":

                evt.target.disable();
                initLoadJS("UIManagementPlayCtrl");
                break;
            case "colorSelect":

                evt.target.disable();
                initLoadJS("UIManagementColorSetting");
                break;
            default:
                break;
        }
    }
    this.progressChange = function (evt) {

        console.log("UIManagementModule::progressChange()...");
    }
    this.run = function () {

        m_plane.getRotationXYZ(m_rotV3);
        m_plane.setRotationXYZ(m_rotV3.x, m_rotV3.y + 1, m_rotV3.z);
        //m_plane.update();

        m_container.getRotationXYZ(m_rotV3);
        m_container.setRotationXYZ(m_rotV3.x + 0.5, m_rotV3.y, m_rotV3.z + 1);
        m_container.update();
    }
};
