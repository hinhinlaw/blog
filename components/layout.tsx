import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const name = "Hin_Law"; // 名称，根据需要修改
export const siteTitle = "Hin Law's Blog"; // 网站标题，根据需要修改

interface Props {
  children: React.ReactNode;
  home?: boolean;
}

export default function Layout({ children, home }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="AiljxBlog——Ailjx的博客" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <script src="https://kit.fontawesome.com/23bebe7f04.js" crossOrigin="anonymous"></script>
      </Head>
      <main>{children}</main>
      {!home && (
        <div className="mt-12">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-color duration-300 ">
            ← 返回
          </Link>
        </div>
      )}
    </div>
  );
}
