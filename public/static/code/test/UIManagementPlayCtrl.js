
function UIManagementPlayCtrl() {

    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;

    let m_btnSize = 24;
    let m_dY = 2.0;
    let m_btnPX = 162.0;
    let m_btnPY = 180.0;
    let m_btns = [];

    this.initialize = function () {

        console.log("UIManagementPlayCtrl::initialize()...");

        VoxCore = window["VoxCore"];

        var UILayoutBase = VoxCore.UILayoutBase;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();

        if (uiLayout.isMobileWeb()) {
            m_btnSize *= 2;
            m_btnPX *= 2;
            m_btnPY *= 2;
        }

        uiLayout.addModule(this, "UIManagementPlayCtrl");
        
        let uuidList = ["playCtr"];
        let nsList = null;
        let selectNSList = null;
        let deselectNSList = null;
        if(uiLayout.getLanguage() == "zh-CN") {
            nsList = ["播放控制"];
            selectNSList = ["停止"];
            deselectNSList = ["播放"];
        }
        else {
            nsList = ["playCtrl"];
            selectNSList = ["pause"];
            deselectNSList = ["play"];
        }
        for(let i = 0; i < uuidList.length; i++) {
            let bar = this.createSelectBtn(nsList[i], uuidList[i], selectNSList[i], deselectNSList[i], true);
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
        m_btnPY += m_btnSize + m_dY;
        if (!visibleAlways) m_btns.push(selectBar);
        return selectBar;
    }
    
    this.selectChange = function (evt) {

        console.log("UIManagementPlayCtrl::selectChange()...");
        if(evt.flag) {
            uiLayout.play();
        }
        else {
            uiLayout.pause();
        }
    }
    this.run = function () {

    }
};
