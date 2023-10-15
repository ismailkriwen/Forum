import { PageLoading } from "@/components/layout/loading";
import { Navbar } from "@/components/layout/navbar/index";
import { Pagination } from "@/components/layout/pagination/index";
import { ProvidersContainer } from "@/components/providers/main";
import { ThemeController } from "@/components/theme";
import { SITE_NAME } from "@/constants";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Announcement } from "./Announcement";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover the Ultimate Blogging Hub: Your Go-To Source for Trending Topics, Expert Advice, and Inspiring Stories! Explore a diverse range of engaging and informative articles on everything from lifestyle and health to technology and travel. Join our vibrant online community and stay up-to-date with the latest trends, tips, and insights. Whether you're a seasoned blogger or a curious reader, our blog website has something for everyone. Start exploring today and unlock a world of knowledge, entertainment, and inspiration!",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ProvidersContainer>
          <Navbar />
          <PageLoading />
          <main className="container pt-4">
            <Pagination />
            <Announcement />
            {children}
          </main>
          <ThemeController />
        </ProvidersContainer>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="dark"
        />
      </body>
    </html>
  );
};

export default RootLayout;
