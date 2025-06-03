"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { db } from "@/configs/firebaseConfig";
import { DataTable } from "@/components/ui/data-table";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
};

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt?.toDate?.();
      return date ? new Intl.DateTimeFormat("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date) : "N/A";
    },
  },
];

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const q = query(collection(db, "contact"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data: Contact[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];

      setContacts(data);
      setLoading(false);
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={contacts} />
      )}
    </div>
  );
};

export default ContactPage;
