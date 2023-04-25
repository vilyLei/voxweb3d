# voxweb3d
TypeScript WebGL 3D Engine Wystem(High Performence for very many times drawcalls(10000+) and 10 millions+ trangles mesh rendering. Runtime environment support WebGL1 and WebGL2, WebAssembly and Multi-Threads Tasks System, env: pc/web/mobile). The code style like c++/java.
About the "VOX": I(Vily) love(O) my family(X: it is the first letter from their names).

Feature:

    1. 精简的代码量, 例如渲染器核心代码Gzipped大小小于56KiB。
       The amount of code is very few, for example: the renderer core code Gzipped size: less 56KiB
       [Demo](http://www.artvily.com/renderCase?sample=distributedRenderer2)

    2. 多线程渲染器功能支持。
       Multi-Thread renderer core support.
       [Demo](http://www.artvily.com/renderCase?sample=wasmMultiThead)

    3. 共享内存情况下, 多GPU(上下文)支持。
       Shared CPU Memory, Multiple Gpu Context support.
       [Demo](http://www.artvily.com/renderCase?sample=multiGpu2)

    4. 面向高性能的渲染运行时(高频执行的渲染过程控制管理)， 支持大规模实时渲染和长时运行稳定性。
       Independent Renderer rendering runtime, for runtime high performence.

    5. 支持分布式运行时代码功能。
       Distributed-Runtime strategy support.
       [Demo](http://www.artvily.com/renderCase?sample=distributedRuntimeLightViewer)

    6. 自动化的内存显存等资源管理。
       Auto resource management: system memory resource and Gpu memory resource, and one system memory resource for Multiple Gpu context memory resource.

    7. 简洁易用的异步数据管理策略, 并且保持数据更新等过程中的运行时性能。
       Asynchronous and convenient resource data management strategy(system memory to gpu memory), for runtime high performence. Inclde: update, new, delete, share those system memory or gpu memory resource.

    8. WebAssembly 支持。
       Wasm(WebAssembly) support.
       [Demo](http://www.artvily.com/renderCase?sample=wasmMultiThead)

    9. 支持多重方式去渲染一个可渲染对象, 渲染过程可灵活控制，也可以使用既定流程。
       Multiple methods to render a renderable entity, enhance rendering control flexibility.

    10.2D UI 系统支持。
       2D UI System support.

    11.渲染场景空间管理系统支持。
       Rendering scene space management system support.

    12.PC鼠标和移动端(包括Pad)touch事件支持。
       pc web client mouse event and mobile(pad) touch event support.
   
    13.引擎实例中动态切换GPU context。
       dynamically switch the GPU context in an engine instance (includes offscreen rendering process).
   
    14.几何数据编辑支持。
       geometry data edting support.

    15.粒子系统支持。
       particle effect system support.

    16.多种模型数据的并行加载并行解析。
       multi-formats geometry model data parsing with concurrency strategy.
   
    17.支持3D或2D游戏开发。
       support 2D or 3D game development.

    Some Features that will be supported in the future:
       RSM, SSDO, VXGI, WebGPU, RayTracing, AI Model

Engine code under the path: "src\vox\"

[More Demos](http://www.artvily.com)

installation and running:

   第一步，全局安装git(https://git-scm.com/downloads)。
   step 1, install global git(https://git-scm.com/downloads).

   第二步，全局安装nodejs(建议大版本为16)(https://nodejs.org/en/)，默认自动安装npm。
   step 2, install global nodejs(The recommended major version is 16)(https://nodejs.org/en/),auto include npm already.

   第三步，全局安装yarn，在你的系统命令终端执行 npm install -g yarn 命令即可。
   step 3, install global yarn(run the "npm install -g yarn" command in your os terminal)

   第四步，下载 Visual Studio Code(https://code.visualstudio.com/Download)，安装。
   step 4, download Visual Studio Code(https://code.visualstudio.com/Download), install it.

   第五步，打开Visual Studio Code程序，然后点击 File 菜单。接着点击 Add Folder to Workerspace 选项, 选择并打开 voxweb3d 文件夹
   step 5, run the Visual Studio Code, then click the File menu. Next, click "Add Folder to Workerspace" item, select and open the voxweb3d folder.

   第六步，在当前工作空间的集成终端。
   step 6, open the integrated terminal in the current workspace.

   第七步，在集成终端中进入 voxweb3d 目录，在此终端中运行 "yarn install"命令，等待一会儿。如果报错，请看：https://blog.csdn.net/vily_lei/article/details/108725829
   step 7, enter the voxweb3d dir from the integrated terminal, and run the "yarn install" command in this terminal. Wait a few minutes.
   if you see some errors, look this link: https://blog.csdn.net/vily_lei/article/details/108725829
    
   第八步，在终端中运行 "yarn dev" 命令，你就能在浏览器上看到相应的3d程序。
   step 8, run the "yarn dev" command, you will see a 3d display in your browser.
   
   第九步，在终端中运行 "yarn build" 命令打包js代码。
   step 9, run the "yarn build" command, it can build relevant js package.

other infomation:

    1. You can find some demos in the src/main.ts file.
