import Head from "next/head";
import { useRouter } from "next/router";

const name = "Hin_Law"; // 名称，根据需要修改
export const siteTitle = "Hin's Blog"; // 网站标题，根据需要修改

interface Props {
  children: React.ReactNode;
  home?: boolean;
}

export default function Layout({ children, home }: Props) {
  const router = useRouter();

  const changeRoute = (page: string) => {
    router.push(page);
  };

  const back = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 mb-14">
      <Head>
        <link rel="icon" href="/images/avatar.jpg" />
        <meta name="description" content="hin的博客" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          src="https://kit.fontawesome.com/23bebe7f04.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <nav className={`flex justify-end items-center pt-6`}>
        <ul className="flex px-3 bg-white rounded-full shadow-lg shadow-gray-100 ring-1 ring-gray-100 w-fit hover:shadow-gray-200 transition-shadow">
          <li
            onClick={() => changeRoute("/")}
            className="px-3 py-2 text-sm text-gray-700 transition-colors hover:text-black cursor-pointer"
          >
            博客
          </li>
          <li
            onClick={() => changeRoute("/about")}
            className="px-3 py-2 text-sm text-gray-700 transition-colors hover:text-black cursor-pointer"
          >
            关于
          </li>
        </ul>
      </nav>
      <main>{children}</main>
      {!home && (
        <div>
          <p
            onClick={back}
            className="text-gray-400 hover:text-gray-600 transition-color duration-300 cursor-pointer"
          >
            ← 返回
          </p>
        </div>
      )}
    </div>
  );
}
