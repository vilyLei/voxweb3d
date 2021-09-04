function ImageProxy() {

    let m_url = "";
    let m_img = null;
    let m_loaded = false;
    this.initialize = function (url) {
        m_url = url;
    }

    this.load = function () {
        if (m_img == null && m_url != "") {
            m_img = new Image();
            m_img.onload = (evt) => {
                m_loaded = true;
                console.log("ImageProxy image("+m_url+") loaded.");
            }
            console.log("ready load image("+m_url+").");
            m_img.src = m_url;
        }
    }
    this.getUrl = function () {
        return m_url;
    }
    this.getImage = function () {
        return m_img;
    }
    this.isLoaded = function () {
        return m_loaded;
    }
}
function UIManagementTexChange() {

    let m_plane = null;
    let m_rotV3 = null;
    let m_container = null;
    let m_ruisc = null;

    var VoxCore = null;
    let uiLayout = null;
    let tex1Btn = null;
    let tex2Btn = null;

    let m_btnSize = 24;
    let m_bgLength = 200.0;
    let m_btnPX = 162.0;
    let m_btnPY = 370.0;
    let m_dY = 2.0;
    let m_btns = [];
    let urls = [
        "static/assets/decorativePattern_01.jpg",
        "static/assets/color_01.jpg"
    ];
    let m_texImg1 = new ImageProxy();
    let m_texImg2 = new ImageProxy();
    let m_currTexImg = null;
    this.initialize = function () {

        console.log("UIManagementTexChange::initialize()...");

        VoxCore = window["VoxCore"];

        var UILayoutBase = VoxCore.UILayoutBase;

        uiLayout = UILayoutBase.GetInstance();
        m_ruisc = uiLayout.getUIScene();

        if (uiLayout.isMobileWeb()) {
            m_btnSize *= 2;
            m_btnPX *= 2;
            m_btnPY *= 2;
        }

        uiLayout.addModule(this);

        m_texImg1.initialize(urls[0]);
        m_texImg1.load();
        m_texImg2.initialize(urls[1]);
        

        tex1Btn = this.createSelectBtn("纹理1", "tex_1", "已使用", "使用", false);
        tex1Btn.nameButton.outColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
        tex1Btn.nameButton.updateColor();
        tex1Btn.select(false);

        tex2Btn = this.createSelectBtn("纹理2", "tex_2", "已使用", "使用", true);
        tex2Btn.nameButton.outColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
        tex2Btn.nameButton.updateColor();
        tex2Btn.deselect(false);

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
    this.useTexImage = function() {
        if (m_currTexImg.getImage() == null) {
            m_currTexImg.load();
        }
    }
    this.changeTex = function () {
        if (tex1Btn.isSelected()) {
            console.log("select texture image 1.");
            m_currTexImg = m_texImg1;
            this.useTexImage();
        }
        else if (tex2Btn.isSelected()) {
            console.log("select texture image 2.");
            m_currTexImg = m_texImg2;
            this.useTexImage();
        }
    }
    this.selectChange = function (evt) {

        console.log("UIManagementTexChange::selectChange()...");
        switch (evt.uuid) {
            case "tex_1":
                if (evt.flag) {
                    tex2Btn.deselect(false);
                }
                else {
                    tex2Btn.select(false);
                }
                this.changeTex();
                break;
            case "tex_2":
                if (evt.flag) {
                    tex1Btn.deselect(false);
                }
                else {
                    tex1Btn.select(false);
                }
                this.changeTex();
                break;
            default:
                break;
        }
    }
    this.run = function () {
        
        if(m_currTexImg != null && m_currTexImg.isLoaded()) {
            console.log("use texture image(" + m_currTexImg.getUrl() + ").");
            let entitys = uiLayout.getEntities();
            console.log("entitys: ",entitys);
            if(entitys.length > 0) {
                let texture = entitys[0].getMaterial().getTextureAt(0);
                texture.setDataFromImage( m_currTexImg.getImage() );
                texture.updateDataToGpu();
            }
            m_currTexImg = null;
        }
    }
};
