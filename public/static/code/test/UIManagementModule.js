
function UIManagementModule() {

    let m_currEntityy = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;

    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_dY = 2.0;
    let m_btnPX = 162.0;
    let m_btnPY = 70.0;
    let m_btns = [];

    function updateBoxUV(box, uvs) {
        let uvs0 = new Float32Array([
            uvs[0], uvs[1], uvs[0], uvs[1],
            uvs[0], uvs[1], uvs[0], uvs[1]
        ]);
        box.setFaceUVSAt(0, uvs0);
        box.setFaceUVSAt(1, uvs0);
        box.setFaceUVSAt(2, uvs0);
        box.setFaceUVSAt(3, uvs);
        box.setFaceUVSAt(4, uvs0);
        box.setFaceUVSAt(5, uvs);

        box.reinitializeMesh();
    }
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
        var ChangeColorMaterial = VoxCore.ChangeColorMaterial;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();

        if (uiLayout.isMobileWeb()) {
            m_btnSize *= 2;
            m_btnPX *= 2;
            m_btnPY *= 2;
        }

        uiLayout.addModule(this, "UIManagementModule");

        m_rotV3 = new Vector3D();

        m_container = new DisplayEntityContainer();
        uiLayout.addToScene(m_container);

        //  let axis = new Axis3DEntity();
        //  axis.initialize(300.0);
        //  uiLayout.addToScene(axis);

        /*
        let plane = new Plane3DEntity();
        plane.name = "plane";
        plane.showDoubleFace();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [uiLayout.getImageTexByUrl("static/assets/decorativePattern_01.jpg")]);
        plane.setXYZ(100, 0.0, 100);
        uiLayout.saveEntity(plane);
        m_container.addEntity(plane);
        m_currEntityy = plane;
        //*/
        let uvs = new Float32Array(
            0.0,    0.0,
            1.0,    0.0,
            1.0,    1.0,
            0.0,    1.0
        );
        
        let material = new ChangeColorMaterial();

        let box = new Box3DEntity();
        box.name = "box";
        box.setMaterial(material);
        //box.initializeSizeXYZ(800,800,30,[uiLayout.getImageTexByUrl("static/assets/metal_02.jpg")]);
        box.initializeSizeXYZ(800,800,30,[
            uiLayout.getImageTexByUrl("static/assets/metal_02.jpg"),
            uiLayout.getImageTexByUrl("static/assets/color_05.jpg")
        ]);
        box.setXYZ(100, 0.0, 100);
        updateBoxUV(box, uvs);
        m_container.addEntity(box);
        uiLayout.saveEntity(box);
        m_currEntityy = box;


        uiLayout.showInfo();
        let vec3 = new Vector3D();
        console.log("vec3: ", vec3);
        let mat4 = new Matrix4();
        console.log("mat4: ", mat4);

        let uuidList = ["playCtr", "colorSelect", "texChange"];
        let nsList = null;
        let selectNSList = null;
        let deselectNSList = null;
        if(uiLayout.getLanguage() == "zh-CN") {
            nsList = ["播放控制代码块", "颜色控制代码块", "纹理替换代码块"];
            selectNSList = ["已加载", "已加载", "已加载"];
            deselectNSList = ["加载", "加载", "加载"];
        }
        else {
            nsList = ["playModule", "colorModule", "textureModule"];
            selectNSList = ["loaded", "loaded", "loaded"];
            deselectNSList = ["load", "load", "load"];
        }
        for(let i = 0; i < uuidList.length; i++) {
            let bar = this.createSelectBtn(nsList[i], uuidList[i], selectNSList[i], deselectNSList[i], false);
            let btn = bar.nameButton;
            btn.outColor.setRGBA4f(1.0,1.0,0.0,0.8);
            btn.updateColor();
        }
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
        m_btnPY += m_btnSize + m_dY;
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
        m_btnPY += m_btnSize + m_dY;
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
        m_btnPY += m_btnSize + m_dY;
        if (!visibleAlways) m_btns.push(proBar);
        return proBar;
    }
    this.selectChange = function (evt) {

        switch(evt.uuid) {
            case "playCtr":

                evt.target.disable();
                evt.target.select(false);
                initLoadJS("UIManagementPlayCtrl");
                break;
            case "colorSelect":

                evt.target.disable();
                evt.target.select(false);
                initLoadJS("UIManagementColorSetting");
                break;
            case "texChange":

                evt.target.disable();
                evt.target.select(false);
                initLoadJS("UIManagementTexChange");
                break;
            default:
                break;
        }
    }
    this.progressChange = function (evt) {

        console.log("UIManagementModule::progressChange()...");
    }
    this.run = function () {

        m_currEntityy.getRotationXYZ(m_rotV3);
        m_currEntityy.setRotationXYZ(m_rotV3.x, m_rotV3.y + 1, m_rotV3.z);
        //m_currEntityy.update();

        m_container.getRotationXYZ(m_rotV3);
        m_container.setRotationXYZ(m_rotV3.x + 0.5, m_rotV3.y, m_rotV3.z + 1);
        m_container.update();
    }
};
