import { ToggleSidebarProvider } from "@/app/(admin)/components/context/useToggle";
import { TabProvider } from "@/app/(admin)/components/context/useTab";

export const AdminProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToggleSidebarProvider>
      <TabProvider>{children}</TabProvider>
    </ToggleSidebarProvider>
  );
};
