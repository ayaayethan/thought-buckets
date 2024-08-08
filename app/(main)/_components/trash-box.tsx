"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();

  const buckets = useQuery(api.buckets.getTrash);
  const restore = useMutation(api.buckets.restore);
  const remove = useMutation(api.buckets.remove);

  const [ search , setSearch ] = useState("");

  const filteredBuckets = buckets?.filter((bucket) => {
    return bucket.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (bucketId: string) => {
    router.push(`/buckets/${bucketId}`);
  }

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    bucketId: Id<"buckets">
  ) => {
    event.stopPropagation();

    const promise = restore({
      id: bucketId
    })

    toast.promise(promise, {
      loading: "Restoring bucket...",
      success: "Bucket restored!",
      error: "Failed to restore bucket."
    })
  };

  const onRemove = (
    bucketId: Id<"buckets">
  ) => {
    const promise = remove({
      id: bucketId
    })

    toast.promise(promise, {
      loading: "Deleting bucket...",
      success: "Bucket deleted!",
      error: "Failed to delete bucket."
    })

    if (params.bucketId === bucketId) {
      router.push("/buckets");
    }
  };

  if (buckets === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg"/>
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4"/>
        <Input
          value={search}
          onChange={((e) => setSearch(e.target.value))}
          className="h-7 px-2 focus-visible:ring-transparent bg-seconadary"
          placeholder="Filter by bucket title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No buckets found.
        </p>
        {filteredBuckets?.map(bucket => (
          <div
            key={bucket._id}
            role="button"
            onClick={() => {onClick(bucket._id)}}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center
            text-primary justify-between"
          >
            <span className="truncate pl-2">
              {bucket.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, bucket._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground"/>
              </div>
              <ConfirmModal onConfirm={() => onRemove(bucket._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200"
                  >
                  <Trash className="h-4 w-4 text-muted-foreground"/>
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}