import { useError } from "@/providers/error-provider";
import { useResponsive } from "@/providers/response-provider";
import "./regexp-hightlighter.css";
export function OutputArea({ result }: { result: string }) {
  const { isMobile } = useResponsive();
  const { error } = useError();

  return (
    <div
      className={`${isMobile ? "h-1/2 w-full" : "w-1/2 h-full"} p-4 ${isMobile ? "border-b" : "border-r"}`}
    >
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div
            className="text-green-500"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        </>
      )}
    </div>
  );
}
