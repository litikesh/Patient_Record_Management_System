import { createContext, useContext, useEffect, useState } from "react";
import { initDatabase } from "../Services/DBServices";

export type DataSyncAction = {
  type: "PATIENT_ADDED" | "PATIENT_UPDATED" | "MEDICAL_RECORD_ADDED";
  payload: Record<string, unknown>;
  timestamp: number;
};

type DatabaseContextType = {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  broadcastAction: (action: DataSyncAction) => void;
  lastSyncAction: DataSyncAction | null;
};

const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isInitialized: false,
  error: null,
  broadcastAction: () => {},
  lastSyncAction: null,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

const BROADCAST_CHANNEL_NAME = "health-management-sync";

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [broadcastChannel, setBroadcastChannel] =
    useState<BroadcastChannel | null>(null);
  const [lastSyncAction, setLastSyncAction] = useState<DataSyncAction | null>(
    null
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError(
          "Failed to initialize database. Please refresh the page and try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

      channel.onmessage = (event) => {
        const action = event.data as DataSyncAction;

        setLastSyncAction(action);

        console.log("Received sync action:", action);
      };

      setBroadcastChannel(channel);

      return () => {
        channel.close();
      };
    } else {
      console.warn("BroadcastChannel API not supported in this browser");
    }
  }, []);

  const broadcastAction = (action: DataSyncAction) => {
    if (broadcastChannel) {
      const actionWithTimestamp = {
        ...action,
        timestamp: action.timestamp || Date.now(),
      };

      broadcastChannel.postMessage(actionWithTimestamp);

      setLastSyncAction(actionWithTimestamp);

      console.log("Broadcasting action:", actionWithTimestamp);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        isLoading,
        isInitialized,
        error,
        broadcastAction,
        lastSyncAction,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
