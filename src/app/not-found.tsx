"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen  text-center relative">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <h2 className="text-2xl mt-2 text-muted ">Page Not Found</h2>
            <p className="text-gray-500 mt-2">
                {` The page you’re looking for doesn’t exist.`}
            </p>
            <Link
                href="/"
                className="mt-4 px-4 py-2 bg-primary rounded-full text-white  hover:bg-primary"
            >
                Go Home
            </Link>
        </div>
    );
}
