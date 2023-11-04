---
title: 从零开始搭建个人博客网站  (hexo+fluid+netlify+twikoo)
comments: true
abbrlink: 8810fcc3
date: 2023-11-04 14:15:05
updated: 2023-11-04 14:15:05
---


## ✨准备工作

+ 一个 [github](https://githhub.com)账号
+ 安装[node.js](https://nodejs.org/en)
+ 安装[git](https://git-scm.com/downloads)

## 🔧安装博客

### 安装[Hexo](https://hexo.io)

使用 npm 安装 Hexo[^1]：

```sh
npm install -g hexo-cli
```

{% note success %}
使用淘宝镜像加速 `npm config set registry http://registry.npmmirror.com`
{% endnote %}

安装完成后新建博客：

```sh
hexo init <folder>
cd <folder>
npm install
```

### 安装[Fluid主题](https://github.com/fluid-dev/hexo-theme-fluid)

下载 最新[release 版本](https://github.com/fluid-dev/hexo-theme-fluid/releases)解压到 themes 目录，并将解压出的文件夹重命名为 fluid

然后在博客目录下创建 `_config.fluid.yml`，将主题的 `_config.yml`内容复制过去[^2]

![](https://hexo-blog-netlify.oss-cn-shenzhen.aliyuncs.com/post/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99/164229.png)

如下修改 Hexo 博客目录中的 `_config.yml`：

```yaml
theme: fluid  # 指定主题

language: zh-CN  # 指定语言，会影响主题显示的语言，按需修改
```

首次使用主题的「关于页」需要手动创建：

```sh
hexo new page about
```

创建成功后修改`/source/about/index.md`，添加`layout` 属性：

```yaml
---
title: 标题
layout: about
---

这里写关于页的正文，支持 Markdown, HTML
```

至此，博客已基本安装完成，以下为常用hexo命令：

```sh
# 生成静态网页
hexo g

#启动服务，默认地址为 http://localhost:4000/ 在浏览器中输入地址即可预览
hexo s

# 删除生成的静态网页
hexo clean

#创建一篇新文章或者新的页面
hexo new [layout] <title>
#文章的布局(layout), 默认为 post,可以通过修改 _config.yml 中的default_layout 参数来指定默认布局
#Hexo 有三种默认布局：post、page 和 draft。在创建这三种不同类型的文件时，它们将会被保存到不同的路径
#而您自定义的其他布局和 post 相同，都将储存到 source/_posts 文件夹
```


## 🎨博客配置

> [Fluid配置文档](https://hexo.fluid-dev.com/docs/guide/)

修改Hexo 博客目录下的` _config.yml`"站点配置" 和 `_config.fluid.yml`"主题配置" 以配置博客

### Slogan(打字机) + [Hitokoto(一言)](https://developer.hitokoto.cn/)

修改主题配置：

```yaml
index:
  slogan:
    enable: true
    text: 这是一条 Slogan
    api:
      enable: false
      url: "https://v1.hitokoto.cn/?c=d"
      method: "GET"
      headers: {}
      keys: ["hitokoto"]
```

`url`: 一言的请求接口，参数c为句子类型见下表

| 参数   | 说明             |
| :----- | :--------------- |
| a      | 动画             |
| b      | 漫画             |
| c      | 游戏             |
| d      | 文学             |
| e      | 原创             |
| f      | 来自网络         |
| g      | 其他             |
| h      | 影视             |
| i      | 诗词             |
| j      | 网易云           |
| k      | 哲学             |
| l      | 抖机灵           |
| 其他值 | 作为 动画 类处理 |

{% note success %}
可选择多个分类，例如： ?c=a&c=c
{% endnote %}

### LaTeX 数学公式

设置主题配置：

```yaml
post:
  math:
    enable: true
    specific: false
    engine: katex
```

更换 Markdown 渲染器：

```sh
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-markdown-it --save
npm install @traptitech/markdown-it-katex --save
```

然后在站点配置中添加：

```yaml
markdown:
  plugins:
    - "@traptitech/markdown-it-katex"
```

安装完成后执行 `hexo clean`

### 文章永久链接 (hexo-abbrlink)

安装hexo-abbrlink：

```sh
npm install hexo-abbrlink --save
```

修改站点配置：

```yaml
#permalink: :year/:month/:day/:title/
permalink: post/:abbrlink/
```

### 页脚显示网站运行时长[^3]

在主题配置中的 footer: content 添加：

```xml
footer:
  content: '
    <a href="https://hexo.io" target="_blank" rel="nofollow noopener"><span>Hexo</span></a>
    <i class="iconfont icon-love"></i>
    <a href="https://github.com/fluid-dev/hexo-theme-fluid" target="_blank" rel="nofollow noopener"><span>Fluid</span></a>
    <div style="font-size: 0.85rem">
      <span id="timeDate">载入天数...</span>
      <span id="times">载入时分秒...</span>
      <script src="/js/duration.js"></script>
    </div>
  '
```

在博客目录下创建 `source/js/duration.js`，内容如下：

```javascript
!(function() {
  /** 计时起始时间，自行修改 **/
  var start = new Date("2020/01/01 00:00:00");

  function update() {
    var now = new Date();
    now.setTime(now.getTime()+250);
    days = (now - start) / 1000 / 60 / 60 / 24;
    dnum = Math.floor(days);
    hours = (now - start) / 1000 / 60 / 60 - (24 * dnum);
    hnum = Math.floor(hours);
    if(String(hnum).length === 1 ){
      hnum = "0" + hnum;
    }
    minutes = (now - start) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
    mnum = Math.floor(minutes);
    if(String(mnum).length === 1 ){
      mnum = "0" + mnum;
    }
    seconds = (now - start) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
    snum = Math.round(seconds);
    if(String(snum).length === 1 ){
      snum = "0" + snum;
    }
    document.getElementById("timeDate").innerHTML = "本站安全运行&nbsp"+dnum+"&nbsp天";
    document.getElementById("times").innerHTML = hnum + "&nbsp小时&nbsp" + mnum + "&nbsp分&nbsp" + snum + "&nbsp秒";
  }

  update();
  setInterval(update, 1000);
})();
```

不要忘记把上面注释的时间改为自己的时间，至此这项功能就引入到 <footer> 里了。

### 评论 ([Twikoo](https://twikoo.js.org/))

[先用netlify部署twikoo](https://twikoo.js.org/backend.html#netlify-%E9%83%A8%E7%BD%B2)

在主题配置中开启并指定评论模块：

```yaml
post:
  comments:
    enable: true
    type: twikoo
```

在下面配置参数：

```yaml
twikoo:
  envId: https://xxx.netlify.app/.netlify/functions/twikoo
  # 将xxx.netlify.app换成自己部署在netlify上的域名
```

twikoo评论系统就此部署好啦，可以点击评论窗口的“小齿轮”图标，设置管理员密码，进入twikoo管理面板中进行进一步配置和管理

## 🔗部署至netlify

{% note success %}
建议使用[Sourcetree](https://sourcetreeapp.com/)管理git仓库
{% endnote %}

在github中新建一个公开仓库，克隆到本地，将博客目录内所有内容移入本地仓库，再推送至远端
然后在netlify中导入该仓库（与部署twikoo同理），就可以通过https://xxx.netlify.app/ 访问网站啦

### Hexo Netlify CMS 在线编辑博客



[^1]: [Hexo文档](https://hexo.io/zh-cn/docs/)
[^2]: [Fluid用户手册](https://hexo.fluid-dev.com/docs/)
[^3]: [Fluid 页脚增加网站运行时长_](https://hexo.fluid-dev.com/posts/fluid-footer-custom/)
