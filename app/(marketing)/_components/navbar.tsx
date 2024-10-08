"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { Spinner } from "@/components/spinner";

import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import Link from "next/link";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-50 bg-background fixed top-0 flex items-center w-full p-6",
      scrolled && "border-b shadow-sm"
    )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex
      items-center gap-x-2">
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">
                Sign Up
              </Button>
            </SignUpButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/buckets">
                  Enter Thought Buckets
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/"/>
            </>
          )
        }
        <ModeToggle />
      </div>
    </div>
  )
}