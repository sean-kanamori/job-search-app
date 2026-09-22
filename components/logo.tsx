export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-10 w-10 text-lg" : size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm";

  return (
    <span
      className={`inline-flex ${dims} flex-shrink-0 items-center justify-center rounded-xl bg-orange-600 font-bold text-white`}
      aria-hidden="true"
    >
      M
    </span>
  );
}
