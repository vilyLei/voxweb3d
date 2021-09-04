
function UIManagementPlayCtrl() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;

    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_btnPX = 162.0;
    let m_btnPY = 150.0;
    let m_btns = [];

    this.initialize = function () {

        console.log("UIManagementPlayCtrl::initialize()...");

        VoxCore = window["VoxCore"];

        var UILayoutBase = VoxCore.UILayoutBase;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();

        if (uiLayout.isMobileWeb()) {
            m_btnSize = 64;
            m_btnPX = 280;
            m_btnPY = 30;
        }
        if (uiLayout.isWebGL1()) {
            m_btnPX += 32;
        }

        uiLayout.addModule(this);

        let playCtrBtn = this.createSelectBtn("播放控制", "playCtr", "停止", "播放", true);
        let btn = playCtrBtn.nameButton;
        btn.outColor.setRGBA4f(1.0,1.0,0.0,0.8);
        btn.updateColor();
        
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
