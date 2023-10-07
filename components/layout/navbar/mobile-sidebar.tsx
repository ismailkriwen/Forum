import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export const MobileSide = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="w-8 h-8" />
        </SheetTrigger>
        <SheetContent side="right" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
};
