import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
