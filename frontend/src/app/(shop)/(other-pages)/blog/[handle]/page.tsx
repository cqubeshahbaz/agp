import BlogPostCart from '@/components/blog-post-cart'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import { getBlogPosts, getBlogPostsByHandle } from '@/data'
import { Facebook02Icon, NewTwitterIcon, PinterestIcon, SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const socialShare = [
  { name: 'Facebook', href: '#', icon: Facebook02Icon },
  { name: 'Twitter', href: '#', icon: NewTwitterIcon },
  { name: 'Pinterest', href: '#', icon: PinterestIcon },
  { name: 'Email', href: '#', icon: SentIcon },
]

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const post = await getBlogPostsByHandle(handle)
  if (!post) {
    return {
      title: 'Blog',
      description:
        'Stay up-to-date with the latest industry news as our marketing teams finds new ways to re-purpose old CSS tricks articles.',
    }
  }
  const { title, excerpt } = post
  return { title, description: excerpt }
}

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const { featuredImage, author, content, date, title, timeToRead } = await getBlogPostsByHandle(handle)

  // only get the first 3 posts
  const relatedPosts = (await getBlogPosts()).slice(0, 3)

  return (
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center py-14 text-center lg:py-16">
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 text-center text-sm">
            <span>
              By <span className="font-medium">{author.name}</span>
              <span className="ms-4">/</span>
            </span>
            <time dateTime={date}>
              {date}
              <span className="ms-4">/</span>
            </time>
            <span>{timeToRead}</span>
          </div>
          <Heading bigger level={1} className="mt-5 font-medium">
            {title}
          </Heading>

          <div className="mt-5 flex items-center gap-x-4">
            <div className="pe-2">
              <span className="">Share</span>
            </div>
            {socialShare.map((item) => (
              <Link key={item.name} href={item.href} className="text-zinc-600 hover:text-zinc-800">
                <span className="sr-only">{item.name}</span>
                <HugeiconsIcon icon={item.icon} size={20} color="text-zinc-800" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>

        {featuredImage.src && (
          <Image
            alt={featuredImage.alt}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 60vw"
            src={featuredImage.src}
            width={featuredImage.width}
            height={featuredImage.height}
            className="mx-auto"
          />
        )}

        <div
          className="mx-auto prose mt-14 lg:prose-xl"
          // dangerouslySetInnerHTML={{ __html: content }}
          // this for demo only, you need to change for the yourself
          dangerouslySetInnerHTML={{
            __html: `<div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure vel officiis ipsum placeat itaque neque
              dolorem modi perspiciatis dolor distinctio veritatis sapiente, minima corrupti dolores necessitatibus
              suscipit accusantium dignissimos culpa cumque.
            </p>
            <p>
              It is a long established fact that a <strong>reader</strong> will be distracted by the readable content of
              a page when looking at its <strong>layout</strong>. The point of using Lorem Ipsum is that it has a
              more-or-less normal 
              <a href="/#" target="_blank" rel="noopener noreferrer">
                distribution of letters.
              </a> 
            </p>
            <ol>
              <li>We want everything to look good out of the box.</li>
              <li>Really just the first reason, that's the whole point of the plugin.</li>
              <li>
                Here's a third pretend reason though a list with three items looks more realistic than a list with two
                items.
              </li>
            </ol>
            <h3>Typography should be easy</h3>
            <p>
              So that's a header for you — with any luck if we've done our job correctly that will look pretty
              reasonable.
            </p>
            <p>Something a wise person once told me about typography is:</p>
            <blockquote>
              <p>
                Typography is pretty important if you don't want your stuff to look like trash. Make it good then it
                won't be bad.
              </p>
            </blockquote>
            <p>It's probably important that images look okay here by default as well:</p>
            <p> Now I'm going to show you an example of an unordered list to make sure that looks good, too:</p>
            <ul>
              <li>So here is the first item in this list.</li>
              <li>In this example we're keeping the items short.</li>
              <li>Later, we'll use longer, more complex list items.</li>
            </ul>
            <p>And that's the end of this section.</p>
            <h2>Code should look okay by default.</h2>
            <p>
              I think most people are going to use <a href="https://highlightjs.org/">highlight.js</a> or 
              <a href="https://prismjs.com/">Prism</a> or something if they want to style their code blocks but it
              wouldn't hurt to make them look <em>okay</em> out of the box, even with no syntax highlighting.
            </p>
            <p>What I've written here is probably long enough, but adding this final sentence can't hurt.</p>
            <p>Hopefully that looks good enough to you.</p>
            <h3>We still need to think about stacked headings though.</h3>
            <h4>
              Let's make sure we don't screw that up with <code>h4</code> elements, either.
            </h4>
            <p>Phew, with any luck we have styled the headings above this text and they look pretty good.</p>
            <p>
              Let's add a closing paragraph here so things end with a decently sized block of text. I can't explain why
              I want things to end that way but I have to assume it's because I think things will look weird or
              unbalanced if there is a heading too close to the end of the document.
            </p>
            <p>What I've written here is probably long enough, but adding this final sentence can't hurt.</p>
          </div>`,
          }}
        ></div>
      </div>

      <Divider className="my-14 sm:my-20 lg:my-24" />

      <div>
        <Heading>
          <span>More</span>
          {` `}
          <span data-slot="italic">articles</span>
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:mx-0 xl:grid-cols-3">
          {relatedPosts.map((post) => (
            <BlogPostCart key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
