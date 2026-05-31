import { useCallback, useEffect, useState } from "react";

import { API_BASE_URL } from "@/constants/api";
import { checkBackendHealth } from "@/services/zentraApi";

type BackendStatus = "checking" | "online" | "offline";

export function useBackendHealth() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [backendName, setBackendName] = useState("Zentra backend");

  const refreshBackendStatus = useCallback(async () => {
    setBackendStatus("checking");

    try {
      const health = await checkBackendHealth();
      setBackendName(health.app);
      setBackendStatus(health.ok ? "online" : "offline");
    } catch {
      setBackendStatus("offline");
    }
  }, []);

  useEffect(() => {
    refreshBackendStatus();
  }, [refreshBackendStatus]);

  return {
    backendStatus,
    backendName,
    backendUrl: API_BASE_URL,
    refreshBackendStatus,
  };
}
