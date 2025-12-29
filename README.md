# school_event_system
校园活动报名系统（简易版，本地部署就能跑）

第一步：环境准备（基础设施）

这是最麻烦的一步，但必须完成。你需要给你的电脑安装这三个软件（相当于搭建机房）：
Node.js: (你应该有了) 官网下载安装 LTS 版本。
MySQL: 安装 MySQL Community Server 
安装后： 使用 Navicat 或 DBeaver 连接本地数据库，创建一个库叫 school_event。
Redis:
Windows用户： 微软早已不维护 Windows 版 Redis，建议去 GitHub 下载 tporadowski/redis 的 Windows 版本 MSI 安装包。
安装后： 启动 redis-server.exe。
RabbitMQ:
需要先安装 Erlang，再安装 RabbitMQ Server。
或者（推荐）： 如果你电脑有 Docker，直接用 Docker 启动最省事（如果不熟悉 Docker，就按上面的方法手动装）。
