import NextAuth, { Theme } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "lib/mongodb";
import { createTransport } from "nodemailer";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // 设置邮箱链接失效时间，默认24小时
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `${host} 注册认证`,
          text: text({ url, host }),
          html: html({ url, host }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(), // TODO: profile.sub?
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          followers: profile.followers,
          verified: true,
        };
      },
      httpOptions: {
        timeout: 50000,
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.username = user.username;
      return session;
    },
  },
});

/**
 *使用HTML body 代替正文内容
 */
function html(params: { url: string; host: string; theme?: Theme }) {
  const { url, host, theme } = params;
  //由于使用
  const escapedHost = host.replace(/\./g, "&#8203;.");

  return `
<body>
  <div style="background:#f2f5f7;display: flex;justify-content: center;align-items: center; height:200px">欢迎注册${escapedHost},点击<a href="${url}" target="_blank">登录</a></div>
</body>
`;
}

/** 不支持HTML 的邮件客户端会显示下面的文本信息 */
function text({ url, host }: { url: string; host: string }) {
  return `欢迎注册 ${host}\n点击${url}登录\n\n`;
}
