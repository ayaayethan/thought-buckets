"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

import dynamic from "next/dynamic";
import { useMemo } from "react";

interface BucketIdPageProps {
  params: {
    bucketId: Id<"buckets">;
  }
}

const BuckedIdPage = ({
  params
} : BucketIdPageProps ) => {
  const bucket = useQuery(api.buckets.getById, {
    bucketId: params.bucketId
  })

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  const update = useMutation(api.buckets.update);

  const onChange = (content: string) => {
    update({
      id: params.bucketId,
      content
    })
  }

  if (bucket === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover preview url={bucket.coverImage}/>
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar preview initialData={bucket}/>
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={bucket.content}
        />
      </div>
    </div>
  )
}

export default BuckedIdPage;