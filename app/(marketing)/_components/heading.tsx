"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas & Plans. Unfied. Welcome to your <br /><span className="underline">
          Thought Bucket
        </span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        A connected workspace where <br />
        better, faster work happens.
      </h3>
      <Button>
        Enter Thought Buckets
        <ArrowRight className="h-4 w-4 ml-2"/>
      </Button>
    </div>
  )
}