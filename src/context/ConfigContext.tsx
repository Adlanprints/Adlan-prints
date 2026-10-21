import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WebsiteSettings } from '../types';

interface ConfigContextValue {
  config: WebsiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: null,
  loading: true,
  error: null,
  refreshConfig: async () => {}
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/config');
      if (!res.ok) {
        throw new Error('Failed to load website configuration');
      }
      const data = await res.json();
      setConfig(data);
      setError(null);
    } catch (err: any) {
      console.error('Config fetch error:', err);
      setError(err.message || 'Error loading configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, error, refreshConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
