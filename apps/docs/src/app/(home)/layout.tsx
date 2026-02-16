import { Nav } from "@/components/Nav";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}
