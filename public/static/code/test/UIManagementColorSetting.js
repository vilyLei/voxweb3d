
function UIManagementColorSetting() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;

    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_btnPX = 162.0;
    let m_btnPY = 250.0;
    let m_btns = [];
    let m_time = 0.0;
    let m_material = null;

    this.initialize = function () {

        console.log("UIManagementColorSetting::initialize()...");

        VoxCore = window["VoxCore"];

        var UILayoutBase = VoxCore.UILayoutBase;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();

        if (uiLayout.isMobileWeb()) {
            m_btnSize *= 2;
            m_btnPX *= 2;
            m_btnPY *= 2;
        }

        var Color4 = VoxCore.Color4;

        uiLayout.addModule(this, "UIManagementColorSetting");

        let colors = [
            new Color4(1.0, 1.0, 1.0, 1.0),
            new Color4(1.0, 0.0, 0.0, 1.0),
            new Color4(0.0, 1.0, 0.0, 1.0),
            new Color4(0.0, 0.0, 1.0, 1.0),
            new Color4(1.0, 0.0, 1.0, 1.0)
        ];
        let uuidList = ["color_white", "color_red", "color_green", "color_blue", "color_purple"];
        let nsList = null;
        let selectNSList = null;
        let deselectNSList = null;
        if (uiLayout.getLanguage() == "zh-CN") {
            nsList = ["使用", "使用", "使用", "使用", "使用"];
            selectNSList = ["白色", "红色", "绿色", "蓝色", "紫色"];
            deselectNSList = ["白色", "红色", "绿色", "蓝色", "紫色"];
        }
        else {
            nsList = ["USE", "USE", "USE", "USE", "USE"];
            selectNSList = ["White", "Red", "Green", "Blue", "Purple"];
            deselectNSList = ["White", "Red", "Green", "Blue", "Purple"];
        }
        for (let i = 0; i < uuidList.length; i++) {
            let bar = this.createSelectBtn(nsList[i], uuidList[i], selectNSList[i], deselectNSList[i], true);
            let color = colors[i];
            bar.nameButton.outColor.copyFrom( color );
            bar.nameButton.updateColor();
            bar.selectionButton.outColor.copyFrom( color );
            bar.selectionButton.updateColor();
        }
    }

    this.createSelectBtn = function (ns, uuid, selectNS, deselectNS, flag, visibleAlways) {

        if (visibleAlways == undefined) {
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

    this.selectChange = function (evt) {

        console.log("UIManagementColorSetting::selectChange()...");
        let entitys = uiLayout.getEntities();
        if (entitys.length > 0) {
            let color = evt.target.nameButton.outColor;
            m_material = entitys[0].getMaterial();
            entitys[0].getMaterial().setRGB3f(color.r, color.g, color.b);
            m_time = 0;
            m_material.setTime(m_time);
            m_material.setFactorXYZ(Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1);
            m_material.setUVOffset(Math.random() * 10, Math.random() * 10);
        }
    }
    this.run = function () {
        if(m_material != null) {
            if(m_time < 100000) {
                m_time += 0.01;
                m_material.setTime(m_time);
            }
        }
    }
};
