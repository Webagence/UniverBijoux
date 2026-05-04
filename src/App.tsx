import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Shop from "./pages/Shop.tsx";
import UniversePage from "./pages/UniversePage.tsx";
import NewArrivals from "./pages/NewArrivals.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Account from "./pages/Account.tsx";
import Orders from "./pages/Orders.tsx";
import Contact from "./pages/Contact.tsx";
import AtelierPage from "./pages/AtelierPage.tsx";
import CGV from "./pages/CGV.tsx";
import Legal from "./pages/Legal.tsx";
import Privacy from "./pages/Privacy.tsx";
import FAQ from "./pages/FAQ.tsx";
import Shipping from "./pages/Shipping.tsx";
import Support from "./pages/Support.tsx";
import TicketDetail from "./pages/TicketDetail.tsx";
import StripeCheckout from "./pages/StripeCheckout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <AdminProvider>
              <CartProvider>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/boutique/:universe" element={<UniversePage />} />
                  <Route path="/nouveautes" element={<NewArrivals />} />
                  <Route path="/produit/:slug" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/paiement" element={<StripeCheckout />} />
                  <Route path="/connexion" element={<Login />} />
                  <Route path="/inscription" element={<Register />} />
                  <Route path="/compte" element={<Account />} />
                  <Route path="/commandes" element={<Orders />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/atelier" element={<AtelierPage />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/mentions-legales" element={<Legal />} />
                  <Route path="/confidentialite" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/livraison" element={<Shipping />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/support/:id" element={<TicketDetail />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </AdminProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
