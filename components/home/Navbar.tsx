"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};



const Navbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const { cart } = useCartStore();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: "accepted" | "dismissed" }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("✅ User accepted the PWA install");
        } else {
          console.log("❌ User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };


  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      try {
        const adminRef = doc(db, "admins", userId);
        const adminSnap = await getDoc(adminRef);
        setIsAdmin(adminSnap.exists());
      } catch (error) {
        console.error("⚠️ Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAdmin(user.uid);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    router.push("/");
    setSidebarOpen(false);
  };

  const cartItemCount = cart.length;

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between px-5 py-4 shadow-sm font-poppins">
        <Link href={"/"} className="cursor-pointer">
          <h1 className="text-xl font-serif">KMK</h1>
          <h1 className="text-2xl uppercase font-semibold">Bee<span className="text-orange-1">hives</span></h1>
        </Link>
       <div className="md:flex gap-5 text-lg hidden">
        <Link href={'/'}>Home</Link>
        <Link href={'/products-page'}>Products</Link>
        <Link href={'/services-page'}>Services</Link>
        <Link href={'/contact'}>Contact</Link>

       </div>

        <div className="flex gap-5 items-center">
          <Link href={"/cart"} className="relative">
            {/* <Image src="/images/cart.png" alt="cart" width={25} height={25} /> */}
            <ShoppingCartIcon/>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-1 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          <div  onClick={() => setSidebarOpen(true)}
            className="cursor-pointer"
            >
               <MenuIcon/>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 md:w-1/3 w-full h-full bg-white shadow-lg transform z-50 font-poppins ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 text-gray-700 text-lg"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>

        <div className="flex flex-col mt-10 px-6">
          <Link href="/" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Home
          </Link>
          <Link href="/products-page" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Products
          </Link>
          <Link href="/services-page" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Services
          </Link>
           <Link href="/login" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Login
          </Link>
          <Link href="/contact" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Contact
          </Link>
          {!loading && isAdmin && (
            <Link href="/admin" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          {showInstallButton && (
            <button
              className="mt-4 w-full text-center bg-orange-2 text-white py-2 rounded hidden"
              onClick={handleInstallClick}
            >
              Install App
            </button>
          )}
          <button className="mt-4 w-full text-center bg-orange-1 text-white py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
