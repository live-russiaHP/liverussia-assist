import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getGetAccountQueryKey,
  useGetAccount,
  useRegisterAccount,
} from '@workspace/api-client-react';
import type { Account, AccountRegistration } from '@workspace/api-client-react';

const STORAGE_KEY = 'live-russia-account-number';

type AccountContextValue = {
  account: Account | null;
  isLoading: boolean;
  register: (input: AccountRegistration) => Promise<Account>;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [localAccount, setLocalAccount] = useState<Account | null>(null);
  const registerMutation = useRegisterAccount();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setAccountNumber(stored))
      .finally(() => setHydrated(true));
  }, []);

  const accountQuery = useGetAccount(accountNumber ?? '', {
    query: {
      enabled: hydrated && Boolean(accountNumber),
      staleTime: 30_000,
      queryKey: getGetAccountQueryKey(accountNumber ?? ''),
    },
  });

  useEffect(() => {
    if (accountQuery.data) setLocalAccount(accountQuery.data);
  }, [accountQuery.data]);

  const register = async (input: AccountRegistration) => {
    const created = await registerMutation.mutateAsync({ data: input });
    await AsyncStorage.setItem(STORAGE_KEY, created.accountNumber);
    setAccountNumber(created.accountNumber);
    setLocalAccount(created);
    return created;
  };

  const refresh = async () => {
    if (accountNumber) await accountQuery.refetch();
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAccountNumber(null);
    setLocalAccount(null);
  };

  const value = useMemo(
    () => ({
      account: localAccount,
      isLoading: !hydrated || accountQuery.isLoading || registerMutation.isPending,
      register,
      refresh,
      signOut,
    }),
    [accountQuery.isLoading, hydrated, localAccount, registerMutation.isPending, accountNumber],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used inside AccountProvider');
  return context;
}