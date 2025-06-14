"use client";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/custom/Navbar"; // Assuming Navbar is in components directory

export default function Home() {
  const user = useUser();
  // console.log(user);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      console.log("Mobile device detected");
      setIsMobileView(true);
    }
  }, []);

  return (
    <SignedIn>
      <div className="root-container bg-zinc-950 text-zinc-300">
        <div className="root-content flex">
          <aside
            className={`main-side-panel ${
              isMobileView ? "w-[10%]" : "w-[145px]"
            }`}
          >
            <Navbar isMobileView={isMobileView} />
          </aside>

          <main
            className={`main-content-container ${
              isMobileView ? "w-[88%]" : "w-full"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SignedIn>
  );
}
