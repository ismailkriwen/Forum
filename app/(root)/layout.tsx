import { BottomBar } from "@/components/bottom-bar";
import { PageLoading } from "@/components/layout/loading";
import { Navbar } from "@/components/layout/navbar/index";
import { Pagination } from "@/components/layout/pagination/index";
import { Providers } from "@/components/providers";
import { SITE_NAME } from "@/constants";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Announcement } from "./Announcement";

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
        <NextTopLoader
          height={3}
          color="#27AE60"
          easing="cubic-bezier(.35,.21,0,1)"
          showSpinner={false}
        />
        <Providers>
          <Navbar />
          <PageLoading />
          <main className="container pt-4 h-fit">
            <Pagination />
            <Announcement />
            {children}
          </main>
          <BottomBar />
        </Providers>
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
