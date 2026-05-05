import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RiNotification3Line, RiSearch2Line } from "@remixicon/react";
import { Input } from "./ui/input";

export function NavMain({
  currentPath,
  items,
}: {
  currentPath: string;
  items: ReadonlyArray<{
    title: string;
    url: string;
    icon?: React.ReactNode;
  }>;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                className="bg-transparent h-8 pl-8"
                placeholder="Pesquisar anotações..."
              />

              <RiSearch2Line className="absolute size-4 top-1/2 -translate-y-1/2 left-2 text-muted-foreground" />
            </div>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0 bg-transparent"
              variant="outline"
            >
              <RiNotification3Line className="size-4" />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={currentPath === item.url}
                render={<a href={item.url} />}
                tooltip={item.title}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
