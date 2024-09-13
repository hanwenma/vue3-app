const xlsx = require("node-xlsx");

const Koa = require("koa");
const app = new Koa();

const cors = require("koa2-cors");

// 处理跨域
app.use(
  cors({
    origin: "*", // 允许来自指定域名请求
    maxAge: 5, // 本次预检请求的有效期，单位为秒
    methods: ["GET", "POST"], // 所允许的 HTTP 请求方法
    credentials: true, // 是否允许发送 Cookie
  })
);

// 响应
app.use(async (ctx) => {
  // 设置 content-type
  ctx.set("Content-Type", "application/json");


  // 将 buffer 返回给前端
  ctx.body = {
    code: 3050,
    message: "Something's wrong!!!"
  };
});

// 将数据转成 Buffer
const JSONToBuffer = (data, options = {}) => {
  let xlsxObj = [
    {
      name: "sheet",
      data: [],
    },
  ];

  data.forEach((item, idx) => {
    // 处理 excel 表头
    if (idx === 0) {
      xlsxObj[0].data.push(Object.keys(item));
    }

    // 处理其他 excel 数据
    xlsxObj[0].data.push(Object.values(item));
  });

  // 返回 buffer 对象
  return xlsx.build(xlsxObj, options);
};

app.listen(3000);




