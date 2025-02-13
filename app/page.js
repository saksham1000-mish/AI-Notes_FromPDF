"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect } from "react";
import Feature from "./components/feature";
import Hero from "./components/hero";
import Layout from "./components/Layout/Layout";

export default function Home() {

  const {user}=useUser();
  const createUser=useMutation(api.user.createUser);

  useEffect(()=>{
    user&&CheckUser();
  },[user])

  const CheckUser=async()=>{
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName
    });

    console.log(result);
  }

  return (
    <div>
      <Layout>
      <Hero/>
      <Feature/>

      <UserButton/>
      </Layout>
    </div>
  );
}
