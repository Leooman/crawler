NodeJS实现爬虫
===============

用 cheerio&request 实现单页信息、图片资源、多层信息的爬取

备注
=======================

代码示例中购房资格测试爬取到的信息保存到了数据库，数据结构参照根目录下的express.sql.example文件

源码地址
==================

https://github.com/Leooman/crawler

使用
==================

```{bash}
git clone git@github.com:Leooman/crawler.git
cd crawler
npm install
DEBUG=my-application ./bin/www || npm run start
```
测试地址
===================
> localhost:3000



