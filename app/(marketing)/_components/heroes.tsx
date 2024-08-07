import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center
    max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px]
        sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/bucket.png"
            fill
            className="object-contain dark:hidden"
            alt="bucket"
          />
          <Image
            src="/bucket-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="bucket"
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block">
          <Image
            src="/ideas.png"
            fill
            className="object-contain dark:hidden"
            alt="ideas"
          />
          <Image
            src="/ideas-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="ideas"
          />
        </div>
      </div>
    </div>
  )
}