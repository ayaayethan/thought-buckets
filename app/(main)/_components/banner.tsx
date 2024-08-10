"use client";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  bucketId: Id<"buckets">
}

export const Banner = ({
  bucketId
}: BannerProps ) => {
  const router = useRouter();
  const remove = useMutation(api.buckets.remove);
  const restore = useMutation(api.buckets.restore);

  const onRemove = () => {
    const promise = remove({
      id: bucketId
    })

    toast.promise(promise, {
      loading: "Deleting bucket...",
      success: "Bucket deleted!",
      error: "Failed to delete bucket."
    })

    router.push("/buckets");
  }

  const onRestore = () => {
    const promise = restore({
      id: bucketId
    });

    toast.promise(promise, {
      loading: "Restoring bucket...",
      success: "Bucket restored!",
      error: "Failed to restore bucket."
    })
  }

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>
        This bucket is in the Trash.
      </p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white
        p-1 px-2 h-auto font-normal"
      >
        Restore bucket
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white
          p-1 px-2 h-auto font-normal"
          >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}