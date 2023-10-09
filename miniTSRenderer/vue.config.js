// console.log("process.env: ",process.env);
let venv = process.env;
let vcmd = venv ? venv.npm_lifecycle_event : "";
let argv = venv.npm_config_argv;
let argvObj = JSON.parse(argv);

let lcScript = process.env.npm_lifecycle_script;
let devDstStr = lcScript;
if(lcScript.indexOf("vue-cli-service serve ") >= 0) {
    if(vcmd != "") {
        // represent dev process
        let srcCodeUrl = process.env.npm_lifecycle_script;
        let i = srcCodeUrl.indexOf("./src");
        srcCodeUrl = srcCodeUrl.slice(i, -1);

        let demoName = "";
        if(argvObj.original && argvObj.original.length > 1) {
            demoName = argvObj.original[1];
        }
        if(demoName != "" && demoName.length > 2) {
            let begin = vcmd.indexOf(":");
            if(begin > 0) {
                demoName = demoName.slice(2);
                let projName = vcmd.slice(begin+1);
                srcCodeUrl = "./src/"+projName+"/" + demoName + ".ts";
            }
        }
        devDstStr = srcCodeUrl;
    }
}

let appDstStr = devDstStr;
console.log("appDstStr: ", appDstStr);

module.exports = {
    pages: {
        index: {
            entry: process.env.NODE_ENV === 'production' ? appDstStr : devDstStr
        }
    },
    filenameHashing: false,
    // 是否为生产环境构建生成 source map
    productionSourceMap: false,

    configureWebpack: config => {
        if (true) {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
                'console.log'
            ];
        }
    },

    devServer: {
        port: 9000,
        disableHostCheck: true
    },

    chainWebpack: config => {
        config.module
            .rule('glsl')
            .test(/\.glsl$/)
            .use('raw')
            .loader('raw-loader')
            .end();
    }
};
