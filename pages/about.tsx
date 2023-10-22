import Layout, { siteTitle } from "@/components/layout";
import { NextPage } from "next";
import Image from "next/image";
import githubSVG from "@/public/svg/github.svg";
import emailSVG from "@/public/svg/envelope-regular.svg";
import Head from "next/head";

interface IProps {}

const About: NextPage<IProps> = () => {
  return (
    <Layout>
      <Head>
        <title>关于 ｜ {siteTitle}</title>
      </Head>
      <div className="pt-10 pb-4 text-zinc-400 space-y-1.5 ">
        <p>👊 我叫Hin / I'm Hin</p>
        <p>🧑‍💻 前端开发者 / Front-end Developer</p>
        <p>🌟 Just share something</p>
      </div>
      <div className="flex gap-4 pb-3 mb-12 border-b-2 border-dashed">
        <a href="https://github.com/hinhinlaw" target="_blank">
          <Image src={githubSVG} alt="github" width={20} />
        </a>
        <a href="https://github.com/hinhinlaw" target="_blank">
          <Image src={emailSVG} alt="email" width={20} />
        </a>
      </div>
    </Layout>
  );
};

export default About;
