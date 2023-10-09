# choco
includes some web 3d tec tutorials、cases、apps、games etc，for studying or sharing


installation and running:

   第一步，全局安装git(https://git-scm.com/downloads)。
   step 1, install global git(https://git-scm.com/downloads).

   第二步，全局安装nodejs(建议大版本为16, 例如nodejs 16.7)(https://nodejs.org/en/)，默认自动安装npm。
   step 2, install global nodejs(The recommended major version is 16)(https://nodejs.org/en/),auto include npm already.

   第三步，全局安装yarn，在你的系统命令终端执行 npm install -g yarn 命令即可。
   step 3, install global yarn(run the "npm install -g yarn" command in your os terminal)

   第四步，下载 Visual Studio Code(https://code.visualstudio.com/Download)，安装。
   step 4, download Visual Studio Code(https://code.visualstudio.com/Download), install it.

   第五步，打开Visual Studio Code程序，然后点击 File 菜单。接着点击 Add Folder to Workerspace 选项, 选择并打开 voxmaterial 文件夹
   step 5, run the Visual Studio Code, then click the File menu. Next, click "Add Folder to Workerspace" item, select and open the voxmaterial folder.

   第六步，在当前工作空间的集成终端。
   step 6, open the integrated terminal in the current workspace.

   第七步，在集成终端中进入 voxmaterial 目录，在此终端中运行 "yarn install"命令，等待一会儿。如果报错，请看：https://blog.csdn.net/vily_lei/article/details/108725829
   step 7, enter the voxmaterial dir from the integrated terminal, and run the "yarn install" command in this terminal. Wait a few minutes.
   if you see some errors, look this link: https://blog.csdn.net/vily_lei/article/details/108725829
   
   第八步，在终端中运行 "yarn dev:tutorial" 命令，你就能在浏览器上看到相应的3d程序。
   step 8, run the "yarn dev:tutorial" command, you will see a 3d display in your browser.
   
   第九步，在终端中运行 "yarn build" 命令打包js代码。
   step 9, run the "yarn build:tutorial" command, it can build relevant js package.

other infomation:

    1. You can find some tutorial demos in the src/tutorial/ dir.
    2. Running the specified tutorial demo, for example, running the Primitives demo: yarn dev:tutorial --Primitives
