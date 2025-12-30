# school_event_system
校园活动报名系统（简易版，本地部署就能跑）

## 第一步：环境准备（基础设施）

这是最麻烦的一步，但必须完成。你需要给你的电脑安装这三个软件（相当于搭建机房）：

[node.js](https://nodejs.org/zh-cn/download):官网下载安装 LTS 版本。

[MySQL](https://dev.mysql.com/downloads/): 安装 MySQL Community Server 
安装后： 使用 Navicat 或 DBeaver 连接本地数据库，创建一个库叫 school_event。

Redis(https://github.com/MicrosoftArchive/redis/releases):
Windows用户： 微软早已不维护 Windows 版 Redis，建议去 GitHub 下载 tporadowski/redis 的 Windows 版本 MSI 安装包。

安装后： 启动 redis-server.exe。

RabbitMQ:
需要先安装 [Erlang](https://www.erlang.org/downloads)，

再安装 [RabbitMQ Server](https://www.rabbitmq.com/docs/download)。
或者（推荐）： 如果你电脑有 Docker，直接用 Docker 启动最省事（如果不熟悉 Docker，就按上面的方法手动装）。

---
## 创建代码
1. 打开你的数据库管理工具，在 school_event 库中运行 SQL语句
2. 编写核心代码，创建5个文件
   1. congif.js
   2. init.js
   3. server.js
   4. worker.js
   5. index.html (模拟用户)

## 执行代码
打开3个命令提示符，分别进入项目路径
1. `node init.js  # 预热数据：输出：[预热完成] 活动: 校园十佳歌手大赛, 库存: 10 已写入 Redis`
2. `node server.js  #启动服务器 # 输出：[MQ] 生产者已就绪 ... 运行在 http://localhost:3000`
3. `node worker.js  #启动消费者or后台：输出：[Worker] 消费者启动，等待任务...`
输出正确表示启动成功！可通过浏览器进入index.html进行测试

