"use client";

import Image from "next/image";

import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Router } from "lucide-react";

import { toast } from "sonner";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation";

const BucketsPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const create = useMutation(api.buckets.create);

  const onCreate = () => {
    const promise = create({
      title: "Untitled"
    })
    .then(bucketId => {
      router.push(`buckets/${bucketId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new bucket...",
      success: "New bucket created!",
      error: "Failed to create a new bucket."
    })


  }

  return (
    <div className="h-full flex flex-col items-center justify-center
    space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Bucket!
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2"/>
        Create a Bucket
      </Button>
    </div>
  )
}

export default BucketsPage;