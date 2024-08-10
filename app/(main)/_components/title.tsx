"use client";

import { Doc } from "@/convex/_generated/dataModel";

interface TitleProps {
  initialData: Doc<"buckets">;
}

export const Title = ({
  initialData
} : TitleProps ) => {
  return (
    <div>
      Title
    </div>
  )
}