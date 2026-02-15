import { Sidebar } from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex max-w-7xl gap-0 px-4">
      <Sidebar />
      <div className="min-w-0 flex-1 py-10 lg:pl-8">
        {children}
      </div>
    </div>
  );
}
