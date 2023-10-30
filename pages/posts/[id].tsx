import type { GetStaticProps, GetStaticPaths } from "next";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../utils/posts";
import Head from "next/head";
import Date from "../../components/date";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
// 引入代码高亮css
import "prismjs/themes/prism-okaidia.min.css";

interface IProps {
  postData: {
    title: string;
    date: string;
    md: string;
    content: MDXRemoteProps;
  };
}

export default function Post({ postData }: IProps) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <h1 className="text-4xl mt-10 mb-2 tracking-tighter text-zinc-700">
        {postData.title}
      </h1>
      <Date dateString={postData.date}></Date>
      <article
        className="
          w-full
          py-6
          mt-6 
          prose
          prose-code:bg-gray-100
          prose-code:rounded
          prose-code:font-normal
          prose-code:px-1
          prose-code:py-1 
          prose-code:mx-[3px] 
          prose-code:break-all 
          prose-code:before:content-['']
          prose-code:after:content-['']
        ">
        <MDXRemote {...postData.content}></MDXRemote>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params!.id as string);
  return {
    props: {
      postData,
    },
  };
};
