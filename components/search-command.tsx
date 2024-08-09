"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const buckets = useQuery(api.buckets.getSearch);
  const [ isMounted, setIsMounted ] = useState(false);

  const toggle = useSearch(store => store.toggle);
  const isOpen = useSearch(store => store.isOpen);
  const onClose = useSearch(store => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down)
  }, [])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  }

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Buckets...`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Buckets">
          {buckets?.map(bucket => (
            <CommandItem
              key={bucket._id}
              value={`${bucket._id}-${bucket.title}`}
              title={bucket.title}
              onSelect={onSelect}
            >
              {bucket.icon ? (
                <p className="mr-2 text-[18px]">{bucket.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>
                {bucket.title}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
