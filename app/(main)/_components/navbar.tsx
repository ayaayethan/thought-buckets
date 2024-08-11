"use client";

import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import BuckedIdPage from "../(routes)/buckets/[bucketId]/page";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

export const Navbar = ({
  isCollapsed,
  onResetWidth
} : NavbarProps ) => {
  const params = useParams();
  const bucket = useQuery(api.buckets.getById, {
    bucketId: params.bucketId as Id<"buckets">
  });

  if (bucket === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
      flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (bucket === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full
      flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={bucket}/>
          <div className="flex items-center gap-x-2">
            <Publish initialData={bucket}/>
            <Menu bucketId={bucket._id} />
          </div>
        </div>
      </nav>
      {bucket.isArchived && (
        <Banner bucketId={bucket._id}/>
      )}
    </>
  )
}