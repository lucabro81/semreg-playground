import { useResponsive } from "@/providers/response-provider";

export function OutputArea({ result }: { result: RegExp | undefined }) {
  const { isMobile } = useResponsive();
  return (
    <div
      className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4 ${isMobile ? "border-b" : "border-r"}`}
    >
      {result?.source}
    </div>
  );
}
