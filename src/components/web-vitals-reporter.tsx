import { useEffect } from "react";
import { startWebVitalsRum } from "@/lib/web-vitals-rum";

/**
 * Mounts once near the document root and starts Core Web Vitals collection.
 * Renders nothing.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    startWebVitalsRum();
  }, []);
  return null;
}
