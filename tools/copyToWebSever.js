
// (A) LOAD MODULES
const path = require("path"),
    fs = require("fs");

function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

let __src_dirname = "../public/static/cospace/";
let __dst_dirname = "d:/vdev/server/voxserver/bin/static/";
// (B) SOURCE & TARGET FOLDERS
const source = path.join(__src_dirname, "ageom/"),
    dst = path.join(__dst_dirname, "cospace/ageom/"),
    ext = ".umd.min.js";
console.log("copy begin...");

function walkSync(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
        var filePath = path.join(currentDirPath, dirent.name);
        if (dirent.isFile()) {
            callback(filePath, dirent);
        } else if (dirent.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
walkSync('../public/static/cospace/', function (filePath, stat) {
    if (filePath.indexOf("umd.min.js") > 0) {
        let path = filePath + "";
        // console.log("find path: ", path);
        let keyStr = "../public/static/";
        let i = keyStr.length;
        let url = "d:/vdev/server/voxserver/bin/static/" +  path.slice(i);
        console.log("find dst url: ", url);
        i = url.lastIndexOf("\\");
        let dir = url.slice(0, i + 1);
        let fileName = url.slice(i+1);
        console.log("find dst dir: ", dir, ", fileName: ", fileName);
        const isExisted = fsExistsSync(dir);
        console.log("isExisted: ", isExisted);
        if (!isExisted) {
            mkdirsSync(dir);
        }
        let currFile = fileName.slice(0, fileName.indexOf(".")) + ".js";
        currFile = currFile.toLowerCase();
        fs.copyFileSync(path, dir + currFile);
    }else if(filePath.indexOf("\\dracoLib\\") > 0) {
        let path = filePath + "";
        // console.log("find path: ", path);
        let keyStr = "../public/static/";
        let i = keyStr.length;
        let url = "d:/vdev/server/voxserver/bin/static/" +  path.slice(i);
        console.log("find dst url: ", url);
        i = url.lastIndexOf("\\");
        let dir = url.slice(0, i + 1);
        let fileName = url.slice(i+1);
        console.log("find dst dir: ", dir, ", fileName: ", fileName);
        const isExisted = fsExistsSync(dir);
        console.log("isExisted: ", isExisted);
        if (!isExisted) {
            mkdirsSync(dir);
        }
        fs.copyFileSync(path, dir + fileName);
    }
});
/*
fs.readdirSync(source).forEach((file) => {
    console.log("file: ", file);
    // console.log("path.basename(file): ", path.basename(file));
    // console.log("path.extname(file): ", path.extname(file));
    //  .umd.min.js
    let ns = path.basename(file);
    //if (path.extname(file).toLowerCase() == ext) {
    if (ns.indexOf("umd.min.js") > 0) {
        const isExisted = fsExistsSync(dst);
        console.log("isExisted: ", isExisted);
        if (!isExisted) {
            // fs.mkdirSync(dst);
            mkdirsSync(dst);
        }
        let currFile = file.slice(0, file.indexOf(".")) + ".js";
        currFile = currFile.toLowerCase();
        console.log("currFile: ", currFile);
        fs.copyFileSync(source + file, dst + currFile);
        console.log(`Copied ${source + file} to ${dst + currFile}`);
    }
});
//*/