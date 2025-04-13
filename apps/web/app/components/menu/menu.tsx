import { useResponsive } from "@/providers/response-provider";
import { Button } from "@workspace/ui/components/button";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@workspace/ui/components/menubar";
import { Menu, X } from "lucide-react";

import packageJson from "../../../package.json";
import { MenuContent } from "./menu-content";

type MenuItemType = {
  label: string;
  items: string[];
};

export function MenuDesktop() {
  return (
    <>
      <Menubar className="border-none shadow-none px-2 flex justify-between">
        <MenubarMenu>
          <MenubarTrigger>Documentation</MenubarTrigger>
          <MenubarContent className="h-[90vh] overflow-y-auto w-[400px]">
            <MenuContent />
          </MenubarContent>
        </MenubarMenu>
        <div className="text-xs text-muted-foreground flex gap-2">
          <span>
            Made by{" "}
            <a
              href="https://github.com/lucabro81"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              @lucabro81
            </a>
          </span>
          <span>-</span>
          <a
            href="https://github.com/lucabro81/semreg"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            SemReg v{packageJson.dependencies.semreg.replace("^", "")}
          </a>
        </div>
      </Menubar>
    </>
  );
}

export function MenuMobileItem({ menu }: { menu: MenuItemType }) {
  return (
    <div key={menu.label} className="px-4 py-2">
      <h3 className="text-sm font-medium mb-2">{menu.label}</h3>
      <div className="space-y-1 ml-2">
        {menu.items.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function MenuMobile() {
  const { mobileMenuOpen, setMobileMenuOpen } = useResponsive();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Menu"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-background border shadow-md z-50 py-4">
          <MenuContent />
        </div>
      )}
    </>
  );
}

export function MainMenu() {
  const { isMobile } = useResponsive();

  return (
    <div className="w-full p-2 border-b relative">
      {isMobile ? <MenuMobile /> : <MenuDesktop />}
    </div>
  );
}
