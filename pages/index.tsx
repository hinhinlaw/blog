import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Link from "next/link";
import Date from "../components/date";

import { getSortedPostsData } from "../utils/posts";
import { useRouter } from "next/router";

interface IProps {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}

const Home: NextPage<IProps> = ({ allPostsData }) => {
  const router = useRouter();

  const onClickTitle = (id: string) => {
    router.push(`/posts/${id}`);
  };

  return (
    <Layout home>
      <Head>
        <title>博客 ｜ {siteTitle}</title>
      </Head>
      <div className="pt-10 pb-2 mb-8 border-b-2 border-dashed">
        <h1 className="text-3xl text-zinc-700 leading-normal tracking-wider font-lato font-medium">
          博客 / Blog
        </h1>
      </div>
      <section>
        <ul>
          {allPostsData.map(({ id, date, title }) => {
            return (
              <li key={id} className="mb-9">
                <p
                  className="text-zinc-600 text-lg cursor-pointer hover:text-zinc-900 transition-colors"
                  onClick={() => onClickTitle(id)}
                >
                  {title}
                </p>
                <small>
                  <Date dateString={date}></Date>
                </small>
              </li>
            );
          })}
        </ul>
      </section>
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
