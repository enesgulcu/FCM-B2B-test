"use client";
import React, { useState } from "react";
import SliderComponent from "@/components/SliderComponent";
import HomeCategories from "@/components/HomeCategories";
import WelcomeSection from "@/components/WelcomeSection";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import FixedHeader from "@/components/FixedHeader";
import MainButtonsComponent from "@/components/MainButtons";
import Loading from "@/components/Loading";

const HomeContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      // console.log("session: ", session);
    } else {
      setIsLoggedIn(false);
    }
  }, [status, session]);

  if (status === "loading") {
    return <Loading />; // EĞER STATUS LOADING ISE LOADING COMPONENTINI DÖN
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white">
        <SliderComponent />
      </div>
      {isLoggedIn ? (
        <>
          <MainButtonsComponent />
          <FixedHeader />
        </>
      ) : null}
      <div className="bg-white">
        {isLoggedIn ? <HomeCategories /> : <WelcomeSection />}
      </div>
    </div>
  );
};

export default HomeContainer;
