"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = useState<any>();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      CreateNewUser();
    }
  }, [isLoaded, isSignedIn]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      console.log("Result", result);
      setUserDetail(result.data?.user);
    } catch (error) {
      console.error("Failed to sync user detail", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;