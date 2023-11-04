import { Navbar } from "@/app/(admin)/components/navbar";
import { AdminProviders } from "@/app/(admin)/components/providers";
import { Sidebar } from "@/app/(admin)/components/sidebar";
import { Providers } from "@/components/providers";
import { SITE_NAME } from "@/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";

export const metadata = {
  title: `${SITE_NAME} | Admin`,
  description:
    "Discover the Ultimate Blogging Hub: Your Go-To Source for Trending Topics, Expert Advice, and Inspiring Stories! Explore a diverse range of engaging and informative articles on everything from lifestyle and health to technology and travel. Join our vibrant online community and stay up-to-date with the latest trends, tips, and insights. Whether you're a seasoned blogger or a curious reader, our blog website has something for everyone. Start exploring today and unlock a world of knowledge, entertainment, and inspiration!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <main className="w-full h-full flex flex-row justify-start">
            <AdminProviders>
              <Sidebar />
              <section className="w-full h-full flex-1">
                <Navbar />
                <section className="container pt-4">{children}</section>
              </section>
            </AdminProviders>
          </main>
        </Providers>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </body>
    </html>
  );
}
