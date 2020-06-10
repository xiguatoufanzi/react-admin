const express = require("express");
const Mock = require("mockjs");
const app = express();
const Random = Mock.Random;

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type, token");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next(); // 触发下一个中间件/路由
});

//二级分类
app.get("/admin/edu/subject/get/:parentId", (req, res, next) => {
  const { parentId } = req.params;

  const total = Random.integer(0, 5);
  const data = Mock.mock({
    total,
    [`items|${total}`]: [
      {
        "_id|+1": 100,
        title: "@ctitle(2,5)",
        parentId,
      },
    ],
  });

  if (total === 1) {
    data.items = [data.items];
  }

  res.json({
    code: 20000, // 成功状态码
    success: true, // 成功
    data, // 成功的具体数据
    message: "", // 失败原因
  });
});

//模拟一级分类数据
app.get("/admin/edu/subject/:page/:limit", (req, res, next) => {
  const { page, limit } = req.params;

  const data = Mock.mock({
    total: Random.integer(+limit + 1, limit * 2),
    [`items|${limit}`]: [
      {
        "_id|+1": 1,
        title: "@ctitle(2,5)",
        parentId: 0,
      },
    ],
  });

  res.json({
    code: 20000, // 成功状态码
    success: true, // 成功
    data, // 成功的具体数据
    message: "", // 失败原因
  });
});

app.listen(9527, "localhost", (err) => {
  if (err) {
    console.log("服务器启动失败", err);
    return;
  }
  console.log("服务器启动成功~");
});
