"use client";

import { SidebarTrigger } from "fumadocs-ui/components/sidebar/base";
import { Nav } from "./Nav";

export function DocsNav() {
  return (
    <Nav
      leading={
        <SidebarTrigger className="-me-2 md:hidden" />
      }
    />
  );
}
