## 个人项目《小生活》前端程序
> 技术栈为 vue + elementUI  
> 在前端模板[vueAdmin-template](https://github.com/PanJiaChen/vueAdmin-template.git)基础上开发  

#### 后端mock数据
由于是个人项目，为了开发方便，项目中没有集成Mock.js，而是使用easy-mock模拟请求后端数据，easy-mock支持Mock.js语法，和使用Mock.js无异，
easy-mock官网不太稳定，推荐使用docker的方式自己安装，安装命令如下:
```shell script
git clone https://github.com/easy-mock/easy-mock-docker.git
cd easy-mock-docker
docker-compose up -d
```
系统内置的演示数据在/mock文件夹，如要手动导入，同时修改/config/index.js文件proxyTable.target为easy-mock项目路径

#### Build Setup

```shell script
# Clone project
git clone https://github.com/sunafei/xsh-web.git

# 进入web项目,xsh-web
cd xsh-web

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org 

# serve with hot reload at localhost:9528
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```