import { ToggleSidebarProvider } from "@/app/(admin)/components/context/useToggle";

export const AdminProviders = ({ children }: { children: React.ReactNode }) => {
  return <ToggleSidebarProvider>{children}</ToggleSidebarProvider>;
};
