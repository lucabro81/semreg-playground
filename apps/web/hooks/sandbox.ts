import { useEffect, useRef } from "react";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};
const basePath = publicRuntimeConfig?.basePath || '';

export function useSandbox<T>() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {

      // ref.: https://github.com/vercel/next.js/issues/74621#issuecomment-2585760180
      const worker = new window.Worker(`${basePath}/semreg.worker.es.js`, { type: 'module' });

      worker.onerror = (error) => {
        console.error("Worker error:", error);
      };

      worker.onmessage = (event) => {
        if (event.data?.type === 'init') {
          console.log("Worker initialized:", event.data);
        }
      };

      workerRef.current = worker;

      return () => {
        workerRef.current?.terminate();
        workerRef.current = null;
      };
    }
  }, []);

  return (userCode: string): Promise<T | undefined> => {
    if (!workerRef.current) {
      console.warn("Worker not ready");
      return Promise.resolve(undefined);
    }

    return new Promise((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        console.log("Received message from worker:", event.data);

        if (event.data && (event.data.result !== undefined || event.data.error !== undefined)) {
          workerRef.current?.removeEventListener('message', messageHandler);

          if (event.data.error) {
            console.error("Worker execution error:", event.data.error);
            resolve(undefined);
          } else {
            resolve(event.data.result);
          }
        }
      };

      workerRef.current?.addEventListener('message', messageHandler);

      workerRef.current?.postMessage({
        code: userCode
      });
    });
  };
}