import NextAuth, { Theme } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "lib/mongodb";
import { createTransport } from "nodemailer";
import { matchEmail } from "@/lib/utils";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // 10min, 设置邮箱链接失效时间，默认24小时
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Welcome to ${host}`,
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
          id: profile.id.toString(),
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
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    async session({ session, user }) {
      // Send properties to the client, like an access_token from a provider.
      if (user?.username) {
        session.username = user?.username;
        session.type = "github";
      } else if (user?.email) {
        const match = matchEmail(user.email);
        session.username = match?.[1] || user.email;
        session.domain = match?.[2];
        session.type = "email";
      }
      console.log("[Auth Callback]", session, user);
      return session;
    },
  },
});

/**
 *使用HTML body 代替正文内容
 */
function html(params: { url: string; host: string; theme?: Theme }) {
  const { url, host, theme } = params;
  const escapedHost = host?.replace(/\./g, "&#8203;.");
  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
  <body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        正在登录 <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">点击登录
                </a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        如果您没有发送此电子邮件，请忽略它。
      </td>
    </tr>
  </table>
</body>
`;
}

/** 不支持HTML 的邮件客户端会显示下面的文本信息 */
function text({ url, host }: { url: string; host: string }) {
  return `欢迎注册 ${host}\n点击${url}登录\n\n`;
}
