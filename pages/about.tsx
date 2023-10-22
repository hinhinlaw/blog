import Layout, { siteTitle } from "@/components/layout";
import { NextPage } from "next";
import Image from "next/image";
import githubSVG from "@/public/svg/github.svg";
import emailSVG from "@/public/svg/envelope-regular.svg";
import Head from "next/head";
import { assetBaseUrl } from "@/constant";

interface IProps {}

const About: NextPage<IProps> = () => {
  return (
    <Layout>
      <Head>
        <title>关于 ｜ {siteTitle}</title>
      </Head>
      <div className="pt-10 pb-2 mb-8 border-b-2 border-dashed">
        <h1 className="text-3xl text-zinc-700 leading-normal tracking-wider font-lato font-medium">
          关于 / About
        </h1>
      </div>
      <div className="pt-1 pb-4 text-zinc-400 space-y-1.5 ">
        <p>👊 我叫Hin / I'm Hin</p>
        <p>🧑‍💻 前端开发者 / Front-end Developer</p>
        <p>🌟 Just share something</p>
      </div>
      <div className="flex gap-4 pb-3 mb-12">
        <a href="https://github.com/hinhinlaw" target="_blank">
          <Image src={githubSVG} alt="github" width={20} />
        </a>
        <a href="https://github.com/hinhinlaw" target="_blank">
          <Image src={emailSVG} alt="email" width={20} />
        </a>
      </div>
      <div className="flex gap-2">
        <div className="width-full">
          <img className="mb-2" src={`${assetBaseUrl}5551697953281_.pic_hd.jpg`}/>
          <img src={`${assetBaseUrl}5611697953288_.pic_hd.jpg`}/>
        </div>
        <div className="width-full">
          <img className="mb-2" src={`${assetBaseUrl}5571697953283_.pic_hd.jpg`}/>
          <img src={`${assetBaseUrl}5591697953286_.pic_hd.jpg`}/>
        </div>
        <div className="width-full">
          <img className="mb-2" src={`${assetBaseUrl}5581697953284_.pic_hd.jpg`}/>
          <img src={`${assetBaseUrl}5601697953287_.pic_hd.jpg`}/>
        </div>
      </div>
    </Layout>
  );
};

export default About;
