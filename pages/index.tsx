import type { NextPage, GetStaticProps } from "next"
import Head from 'next/head'
import Layout, {siteTitle} from "../components/layout"
import Link from 'next/link'
import Date from '../components/date'

import { getSortedPostsData } from "../utils/posts"

interface IProps {
  allPostsData: {
    date: string
    title: string
    id: string
  }[]
}

const Home: NextPage<IProps> = ({allPostsData}) =>{
  return (
    <Layout home>
      <div>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className="text-xl leading-normal text-center">
          <p>welcome to my blog</p>
        </section>
        <section className="text-xl leading-normal pt-4">
          <h2 className="text-2xl my-4 font-bold">Blog</h2>
          <ul>
            {
              allPostsData.map(({id, date, title}) => {
                return (
                  <li key={id} className="mb-5">
                    <Link href={`/posts/${id}`}>{title}</Link>
                    <br/>
                    <small>
                      <Date dateString={date}></Date>
                    </small>
                  </li>
                )
              })
            }
          </ul>
        </section>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default Home