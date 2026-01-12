import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { notFound } from "next/navigation";
import Container from "@/components/elements/container";
import Footer from "@/components/layout/footer";

const components = {
  // You can add custom components here if needed
};


const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;


  const filePath = path.join(process.cwd(), "src/content/legal", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf8");
  const { content: mdxContent, data: frontmatter } = matter(raw);

  const title =
    frontmatter.title ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1 text-2xl text-center text-white">
        <Container className="flex-1">
          <div className="min-h-50  flex justify-center items-center">
            <div className="py-10">
              <span className="uppercase font-bold text-lg text-gray-300">Legal</span>
              <h2 className="text-5xl mt-6 text-white capitalize ">{title}</h2>
              <span className=" text-lg text-gray-400">Date of Revision: 20-10-2025</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none markdown-content  ">
            <MDXRemote
              source={mdxContent}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
              components={components}
            />
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default page;