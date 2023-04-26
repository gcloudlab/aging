<h1 align="center">Aging</h1>

## 特性与功能

- 用一张照片生成你从年幼到年老的3秒GIF动图
- 使用 Workers 从 Cloudflare R2 存储和检索照片
- 通过 Upstash 缓存24小时后自动删除照片
- NextAuth 授权，MongoDB 存储用户信息

## 环境变量

> 将文件 `.env.example` 重命名为 `.env`


| 变量                            | 描述             | 示例                                   |
| ------------------------------- | ---------------- | -------------------------------------- |
| `REPLICATE_API_TOKEN`           | replicate        | `fdsgsfasfadadasfasgdfhb`              |
| `UPSTASH_REDIS_REST_URL`        |                  | `https://apn1-xxx-xxx                  |
| .upstash.io`                    |
| `UPSTASH_REDIS_REST_TOKEN`      |                  | `xxxxxx=`                              |
| `QSTASH_TOKEN`                  |                  | `xxxxxx=`                              |
| `QSTASH_CURRENT_SIGNING_KEY`    |                  | `sig_xxxxx`                            |
| `QSTASH_NEXT_SIGNING_KEY`       |                  | `sig_xxxxx`                            |
| `NEXT_PUBLIC_CLOUDFLARE_WORKER` |                  | `https://project.username.workers.dev` |
| `CLOUDFLARE_WORKER_SECRET`      | 随机 token       | `sfhggdjhkghkgdk`                      |
| `GITHUB_CLIENT_ID`              | OAuth App ID     | `dgvsfdahdfajdfag`                     |
| `GITHUB_CLIENT_SECRET`          | OAuth App SECRET | `fsdagfadshfdahgfasgsadg`              |
| `NEXTAUTH_SECRET`               | 随机 token       | `safadsgdsagfdgfdsgdf`                 |
| `MONGODB_URI`                   | uri              | `mongodb+srv://...`                    |


## 部署到 Vercel

### 点击按钮一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Aging%20%E2%80%93%C2%A0See%20how%20well%20you%20age%20with%20AI&demo-description=Age%20transformation%20AI%20app%20powered%20by%20Next.js%2C%20Replicate%2C%20Upstash%2C%20and%20Cloudflare%20R2%20%2B%20Workers.&demo-url=https%3A%2F%2Fai.aging.run%2F&project-name=Aging%20%E2%80%93%C2%A0See%20how%20well%20you%20age%20with%20AI&repository-name=Aging&repository-url=https%3A%2F%2Fgithub.com%2Fgcloudlab%2Faging&from=templates&env=REPLICATE_API_TOKEN%2CREPLICATE_WEBHOOK_TOKEN%2CCLOUDFLARE_WORKER_SECRET%2CPOSTMARK_TOKEN&envDescription=How%20to%20get%20these%20env%20variables%3A%20&envLink=https%3A%2F%2Fgithub.com%2Fgcloudlab%2Faging%2Fblob%2Fmaster%2F.env.example)

### 然后填写环境变量

- 注册 [ReplicateHQ](https://replicate.com/) 帐户以获取 `REPLICATE_API_TOKEN` 环境变量。
- 注册 [Upstash](https://upstash.com/) 帐户以获取 `Upstash Redis` 和 `QStash` 环境变量。
- 创建一个 [Cloudflare R2 实例](https://www.cloudflare.com/lp/pg-r2/) 和 [Cloudflare Worker](https://workers.cloudflare.com/) 来处理图片上传和读取（下方有详细介绍）。

Cloudflare R2 设置说明

- 在 Cloudflare 创建一个 [R2存储桶](https://www.cloudflare.com/lp/pg-r2/)(R2 bucket)。
- 使用下面的代码创建一个 [Cloudflare Worker](https://workers.cloudflare.com/)。
- 在 `Settings > R2 Bucket Bindings` 将您的工作程序绑定到您的R2实例。
- 为保证安全性，请在 `Settings > Environment Variables` 下设置 `AUTH_KEY_SECRET` 变量（您可以在[此处](https://generate-secret.vercel.app/32)生成随机token）。
- 用你自己的 Cloudflare Worker 端点替换项目中的 `older.yesmore.workers.dev` 代码片段。

Cloudflare Worker Code: 

```js
// Check requests for a pre-shared secret
const hasValidHeader = (request, env) => {
  return request.headers.get("X-CF-Secret") === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request, env, key) {
  switch (request.method) {
    case "PUT":
    case "DELETE":
      return hasValidHeader(request, env);
    case "GET":
      return true;
    default:
      return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (!authorizeRequest(request, env, key)) {
      return new Response("Forbidden", { status: 403 });
    }

    switch (request.method) {
      case "PUT":
        await env.MY_BUCKET.put(key, request.body);
        return new Response(`Put ${key} successfully!`);
      case "GET":
        const object = await env.MY_BUCKET.get(key);

        if (object === null) {
          return new Response("Object Not Found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);

        return new Response(object.body, {
          headers,
        });
      case "DELETE":
        await env.MY_BUCKET.delete(key);
        return new Response("Deleted!");

      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "PUT, GET, DELETE",
          },
        });
    }
  },
};

```

then have fun~
## License

[GPN](./LICENSE)