import Image from "next/image";

const SIZES = { sm: 24, md: 32, lg: 40 };

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = SIZES[size];

  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={px}
      height={px}
      className="flex-shrink-0"
      aria-hidden="true"
    />
  );
}
