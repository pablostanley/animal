import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXContent } from "mdx/types";
import type { TOCItemType } from "fumadocs-core/toc";
import { EasingsPlayground } from "@/components/docs/EasingsPlayground";
import { PresetsExplorer } from "@/components/docs/PresetsExplorer";
import { PresenceDemo } from "@/components/docs/PresenceDemo";
import { StaggerDemo } from "@/components/docs/StaggerDemo";
import { FadeUpDemo } from "@/components/docs/FadeUpDemo";
import { ManifestViewer } from "@/components/docs/ManifestViewer";
import { CopyPageMarkdown } from "@/components/CopyPageMarkdown";

const customComponents = {
  ...defaultMdxComponents,
  EasingsPlayground,
  PresetsExplorer,
  PresenceDemo,
  StaggerDemo,
  FadeUpDemo,
  ManifestViewer,
};

interface MdxPageData {
  body: MDXContent;
  toc: TOCItemType[];
  full?: boolean;
  title?: string;
  description?: string;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as unknown as MdxPageData;
  const MDX = data.body;

  return (
    <DocsPage
      toc={data.toc}
      full={data.full}
      tableOfContent={{
        footer: <CopyPageMarkdown slug={params.slug} />,
      }}
    >
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={customComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
