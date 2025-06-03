"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { auth, db } from "@/configs/firebaseConfig";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login"); // redirect unauthenticated users
        return;
      }

      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data().isAdmin === true) {
        setIsAdmin(true); // grant access
      } else {
        setIsAdmin(false); // deny access
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isAdmin === null) return <div className="p-5">Verifying admin access...</div>;
  if (!isAdmin)
    return (
      <div className="p-5 text-red-500 font-semibold">
        Access Denied. Admins only.
      </div>
    );

  return (
    <div className="p-5 font-poppins">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/items">
          <div className="border p-4 text-center hover:shadow-lg cursor-pointer">
            Manage Products
          </div>
        </Link>
        <Link href="/admin/orders">
          <div className="border p-4 text-center hover:shadow-lg cursor-pointer">
            {"Today's"} Orders
          </div>
        </Link>
        <Link href="/admin/contacts">
          <div className="border p-4 text-center hover:shadow-lg cursor-pointer">
            Contact Inquiries
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
