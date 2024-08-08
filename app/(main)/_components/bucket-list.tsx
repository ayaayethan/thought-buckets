"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface BucketListProps {
  parentBucketId?: Id<"buckets">;
  level?: number;
  data?: Doc<"buckets">[];
}

export const BucketList = ({
  parentBucketId,
  level = 0
} : BucketListProps) => {
  const params = useParams();
  const router = useRouter();
  const [ expanded, setExpanded ] = useState<Record<string, boolean>>({});

  const onExpand = (bucketId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [bucketId]: !prevExpanded[bucketId]
    }))
  };

  const buckets = useQuery(api.buckets.getSidebar, {
    parentBucket: parentBucketId
  });

  const onRedirect = (bucketId: string) => {
    router.push(`/buckets/${bucketId}`);
  }

  if (buckets === undefined) {
    return (
      <>
        <Item.Skeleton level={level}/>
        {level === 0 && (
          <>
            <Item.Skeleton level={level}/>
            <Item.Skeleton level={level}/>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No buckets
      </p>
      {
        buckets.map(bucket => (
          <div key={bucket._id}>
            <Item
              id={bucket._id}
              onClick={() => onRedirect(bucket._id)}
              label={bucket.title}
              icon={FileIcon}
              bucketIcon={bucket.icon}
              active={params.bucketId === bucket._id}
              level={level}
              onExpand={() => onExpand(bucket._id)}
              expanded={expanded[bucket._id]}
            />
            {
              expanded[bucket._id] && (
                <BucketList
                  parentBucketId={bucket._id}
                  level = {level + 1}
                />
              )
            }
          </div>
        ))
      }
    </>
  )
}