import fs from 'fs'
import path from 'path'
// 获取元数据
import matter from 'gray-matter'
// 处理日期
import { parseISO } from 'date-fns'
import {serialize} from 'next-mdx-remote/serialize'
// markdown代码高亮
import prism from 'remark-prism'
// 使markdown的链接是在新页面打开链接
import externalLinks from 'remark-external-links'

interface MatterMark {
  data: { date: string; title: string };
  content: string;
  [key: string]: unknown;
}

// posts目录路径
const postsDirectory = path.join(process.cwd(), 'posts')
// 获取posts目录下的所有文件名（带后缀）
const fileNames = fs.readdirSync(postsDirectory)

/**
 * 获取所有文章用于展示首页列表的数据
 * @returns 
 */
export function getSortedPostsData() {
  // 获取所有md文件用于展示首页列表的数据，包含id，元数据（标题，时间）
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)

    // 读取.md文件内容
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 使用matter提取.md文件元数据: {data: {//元数据}, content: '内容'}
    const matterResult = matter(fileContents)

    return {
      id,
      ...(matterResult.data as MatterMark['data'])
    }
  })

  return allPostsData.sort(({date: a}, {date:b}) => 
    parseISO(a) < parseISO(b) ? 1 : -1
  )
}

/**
 * 获取所有文章id（文件名）
 * @returns 
 */
export function getAllPostIds() {
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

/**
 * 获取指定文章内容
 * @param id .md文件的id
 */
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  return {
    content: await serialize(matterResult.content, {
      mdxOptions: {remarkPlugins: [prism, externalLinks]}
    }),
    ...(matterResult.data as MatterMark['data'])
  }
}