import { useResponsive } from "@/hooks/responsive";
import { Button } from "@workspace/ui/components/button";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@workspace/ui/components/menubar";
import { X, Menu } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const menuItems = [
  {
    label: "File",
    items: ["New", "Open", "Save", "Save As"],
  },
  {
    label: "Edit",
    items: ["Cut", "Copy", "Paste"],
  },
  {
    label: "View",
    items: ["Settings", "Preferences"],
  },
  {
    label: "Help",
    items: ["Documentation", "About"],
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
              <>
                <MenubarItem key={item}>{item}</MenubarItem>
                {index === 1 && array.length > 3 && <MenubarSeparator />}
              </>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}

export function MenuMobile({
  setMobileMenuOpen,
  mobileMenuOpen,
}: {
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
}) {
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

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full bg-background border shadow-md z-50 py-4">
          <div className="px-4 pb-2 border-b mb-2">
            <h2 className="font-medium">Menu</h2>
          </div>
          {menuItems.map((menu) => (
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
          ))}
        </div>
      )}
    </>
  );
}

export function MainMenu() {
  const { isMobile, mobileMenuOpen, setMobileMenuOpen } = useResponsive();

  return (
    <div className="w-full p-2 border-b relative">
      {isMobile ? (
        <MenuMobile
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
        />
      ) : (
        <MenuDesktop />
      )}
    </div>
  );
}
