import URLFilter from "../../cospace/app/utils/URLFilter";

interface DemoItem {
    name: string;
    info: string;
    url?: string;
}
interface DemoData {
    demos: DemoItem[];
}
declare var CURR_PAGE_ST_INFO_LIST: any;
declare var hljs: any;
export class HighlightCode {

    constructor() { }

    initialize(): void {

        console.log("HighlightCode::initialize()......");
       
        let cssStr = "";
        let jsStr = "";
        let cssUrl = "http://localhost:9090/static/extern/jslibs/default.min.css";
        let jsUrl = "http://localhost:9090/static/extern/jslibs/highlight.min.js";

        this.loadFileData(cssUrl, (url: string, dataStr: string): void => {
            cssStr = dataStr;
            this.checkData(cssStr, jsStr);
        })
        this.loadFileData(jsUrl, (url: string, dataStr: string): void => {
            jsStr = dataStr;
            this.checkData(cssStr, jsStr);
        })
    }
    private checkData(cssStr: string, jsStr: string): void {
        if (cssStr != "" && jsStr != "") {
            console.log("checkData >>>>>>>>>>");
            this.initHtmlHead(cssStr, jsStr);
        }
    }
    private loadFileData(url: string, onload: (url: string, data: string) => void): void {
        // let appUrl = this.m_host + "static/voxweb3d/demos/camRoaming.js";

        let codeLoader = new XMLHttpRequest();
        codeLoader.open("GET", url, true);
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }
        codeLoader.onload = evt => {
            onload(url, codeLoader.response);
        }
        codeLoader.send(null);
    }
    private initHtmlHead(cssStr: string, jsCodeStr: string): void {
        
        // var cssLink = document.createElement('link');
        // cssLink.rel = 'stylesheet';
        // cssLink.type = 'text/css';
        // cssLink.href = cssUrl;
        // document.head.appendChild(cssLink);

        var styleCss = document.createElement('style');
        styleCss.innerText = cssStr;
        document.head.appendChild(styleCss);
        console.log("styleCss: ", styleCss);

        let scriptEle = document.createElement("script");
        scriptEle.onerror = evt => {
            console.error("module script onerror, e: ", evt);
        };
        scriptEle.type = "text/javascript";
        scriptEle.innerHTML = jsCodeStr;
        document.head.appendChild(scriptEle);

        this.initHtml2();
    }
    private initHtml(): void {
        let htmlStr = "<strong>test a sentence.</strong>";
        let codeStr =
            `
        <strong>
    <pre><code class="language-typescript">
/**
 * a demo main class
 */
export class DemoBase {
    private m_init = true;

    constructor() { }

    initialize(): void {
        console.log("DemoBase::initialize()......");
        if (this.m_init) {
            this.m_init = false;
        }
    }
    run(): void {
    }
}
export default DemoBase;
</code></pre>
</strong>
        `;
        let body = document.body;
        body.innerHTML = htmlStr + codeStr;
        // hljs.highlightElement(body);
        // document.addEventListener('DOMContentLoaded', (event) => {
        //     document.querySelectorAll('pre code').forEach((el) => {
        //         hljs.highlightElement(el);
        //     });
        // });
        document.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el);
        });
    }

    private initHtml1(): void {
        let htmlStr = "<strong>test a sentence.</strong>";
        let codeStr =
            `
        <strong>
    <pre><code class="language-typescript">
/**
 * a demo main class
 */
export class DemoBase {
    private m_init = true;

    constructor() { }

    initialize(): void {
        console.log("DemoBase::initialize()......");
        if (this.m_init) {
            this.m_init = false;
        }
    }
    run(): void {
    }
}
export default DemoBase;
</code></pre>
</strong>
        `;
        let body = document.body;
        body.innerHTML = htmlStr + codeStr;
        
        hljs.highlightAll();
    }
    private initHtml2(): void {
        let htmlStr = "<strong>test a sentence.</strong>";
        let codeStr =
            `
        <strong>
    <pre id="code_01"><code class="language-typescript">
/**
 * a demo main class
 */
export class DemoBase {
    private m_init = true;

    constructor() { }

    initialize(): void {
        console.log("DemoBase::initialize()......");
        if (this.m_init) {
            this.m_init = false;
        }
    }
    run(): void {
    }
}
export default DemoBase;

</code></pre>
</strong>
        `;
        let body = document.body;
        body.innerHTML = htmlStr + codeStr;
        // hljs.highlightElement(body);
        // document.addEventListener('DOMContentLoaded', (event) => {
        //     document.querySelectorAll('pre code').forEach((el) => {
        //         hljs.highlightElement(el);
        //     });
        // });
        // document.querySelectorAll('pre code').forEach((el) => {
        //     hljs.highlightElement(el);
        // });

        let ele01 = document.getElementById("code_01");
        hljs.highlightElement(ele01);
    }
}

export default HighlightCode;
