"use client";

import React from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // adjust the path based on your setup

const Footer = () => {
  const handleOpenMail = () => {
    window.location.href = "mailto:support@youruniverse.ai";
  };

  return (
    <div className="flex flex-col relative ">
      <div className="flex py-5 justify-center items-center gap-2 text-white  ">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="hover:underline">Contact</button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-primary bg-primary/30 backdrop-blur-sm ">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Open Preferred Email ?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to open your preferred email to contact YourUniverse.AI
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOpenMail}>
                Yes
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <span >-</span>
        <Link href="/attributes" className=" hover:underline">Attribution Page</Link>
        <span >-</span>
        <Link href="/legal" className=" hover:underline">Legal</Link>

      </div>
    </div>
  );
};

export default Footer;
