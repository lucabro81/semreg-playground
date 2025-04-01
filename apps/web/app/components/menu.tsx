import { useResponsive } from "@/providers/response-provider";
import { Button } from "@workspace/ui/components/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@workspace/ui/components/menubar";
import { Menu, X } from "lucide-react";
import { Fragment } from "react";

type MenuItem = {
  label: string;
  items: string[];
};

const menuItems: MenuItem[] = [
  {
    label: "Documentation",
    items: ["New", "Open", "Save", "Save As"],
  },
];

export function MenuDesktop() {
  return (
    <Menubar className="border-none shadow-none px-2">
      {menuItems.map((menu) => (
        <MenubarMenu key={menu.label}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>
            {menu.items.map((item, index, array) => (
              <Fragment key={item}>
                <MenubarItem key={item}>{item}</MenubarItem>
                {index === 1 && array.length > 3 && <MenubarSeparator />}
              </Fragment>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}

export function MenuMobileItem({ menu }: { menu: MenuItem }) {
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
          {menuItems.map((menu) => (
            <MenuMobileItem key={menu.label} menu={menu} />
          ))}
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
