import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Link from "next/link";
import Date from "../components/date";
import githubSVG from '@/public/svg/github.svg'
import emailSVG from '@/public/svg/envelope-regular.svg'

import { getSortedPostsData } from "../utils/posts";
import Image from "next/image";

interface IProps {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}

const Home: NextPage<IProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <div>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <div className="pt-10 pb-4 text-zinc-400 space-y-1.5 ">
          <p>👊 我叫Hin / I'm Hin</p>
          <p>🧑‍💻 前端开发者 / Front-end Developer</p>
          <p>🌟 Just share something</p>
        </div>
        <div className="flex gap-4 pb-3 mb-12 border-b-2 border-dashed">
          <a href='https://github.com/hinhinlaw' target="_blank">
            <Image src={githubSVG} alt="github" width={20}/>
          </a>
          <a href='https://github.com/hinhinlaw' target="_blank">
            <Image src={emailSVG} alt="email" width={20}/>
          </a>
        </div>
        <section className="text-xl leading-normal">
          <ul>
            {allPostsData.map(({ id, date, title }) => {
              return (
                <li key={id} className="mb-5">
                  <Link href={`/posts/${id}`}>{title}</Link>
                  <br />
                  <small>
                    <Date dateString={date}></Date>
                  </small>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default Home;
