import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Account, AccountAccessUpdate, AccountRegistration, AccountUpdate, DashboardStats, HealthStatus, KnowledgeItem, ListKnowledgeParams } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListKnowledgeUrl: (params?: ListKnowledgeParams) => string;
/**
 * @summary Search the Live Russia knowledge base
 */
export declare const listKnowledge: (params?: ListKnowledgeParams, options?: Parameters<typeof customFetch>[1]) => Promise<KnowledgeItem[]>;
export declare const getListKnowledgeQueryKey: (params?: ListKnowledgeParams) => readonly ["/api/knowledge", ...ListKnowledgeParams[]];
export declare const getListKnowledgeQueryOptions: <TData = Awaited<ReturnType<typeof listKnowledge>>, TError = ErrorType<unknown>>(params?: ListKnowledgeParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listKnowledge>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listKnowledge>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListKnowledgeQueryResult = NonNullable<Awaited<ReturnType<typeof listKnowledge>>>;
export type ListKnowledgeQueryError = ErrorType<unknown>;
/**
 * @summary Search the Live Russia knowledge base
 */
export declare function useListKnowledge<TData = Awaited<ReturnType<typeof listKnowledge>>, TError = ErrorType<unknown>>(params?: ListKnowledgeParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listKnowledge>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetKnowledgeUrl: (id: number) => string;
/**
 * @summary Get a knowledge entry
 */
export declare const getKnowledge: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<KnowledgeItem>;
export declare const getGetKnowledgeQueryKey: (id: number) => readonly [`/api/knowledge/${number}`];
export declare const getGetKnowledgeQueryOptions: <TData = Awaited<ReturnType<typeof getKnowledge>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKnowledge>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKnowledge>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKnowledgeQueryResult = NonNullable<Awaited<ReturnType<typeof getKnowledge>>>;
export type GetKnowledgeQueryError = ErrorType<void>;
/**
 * @summary Get a knowledge entry
 */
export declare function useGetKnowledge<TData = Awaited<ReturnType<typeof getKnowledge>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKnowledge>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Get dashboard summary
 */
export declare const getDashboardStats: (options?: Parameters<typeof customFetch>[1]) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRegisterAccountUrl: () => string;
/**
 * @summary Register an assistant account
 */
export declare const registerAccount: (accountRegistration: AccountRegistration, options?: Parameters<typeof customFetch>[1]) => Promise<Account>;
export declare const getRegisterAccountMutationKey: () => readonly ["registerAccount"];
export declare const getRegisterAccountMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
export type RegisterAccountMutationResult = NonNullable<Awaited<ReturnType<typeof registerAccount>>>;
export type RegisterAccountMutationBody = BodyType<AccountRegistration>;
export type RegisterAccountMutationError = ErrorType<void>;
export type RegisterAccountMutationVariables = {
    data: BodyType<AccountRegistration>;
};
/**
* @summary Register an assistant account
*/
export declare const useRegisterAccount: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerAccount>>, TError, RegisterAccountMutationVariables, TContext>;
export declare const getGetAccountUrl: (accountNumber: string) => string;
/**
 * @summary Get an account by its static number
 */
export declare const getAccount: (accountNumber: string, options?: Parameters<typeof customFetch>[1]) => Promise<Account>;
export declare const getGetAccountQueryKey: (accountNumber: string) => readonly [`/api/accounts/${string}`];
export declare const getGetAccountQueryOptions: <TData = Awaited<ReturnType<typeof getAccount>>, TError = ErrorType<void>>(accountNumber: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAccountQueryResult = NonNullable<Awaited<ReturnType<typeof getAccount>>>;
export type GetAccountQueryError = ErrorType<void>;
/**
 * @summary Get an account by its static number
 */
export declare function useGetAccount<TData = Awaited<ReturnType<typeof getAccount>>, TError = ErrorType<void>>(accountNumber: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAccount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAccountUrl: (accountNumber: string) => string;
/**
 * @summary Update the current account
 */
export declare const updateAccount: (accountNumber: string, accountUpdate: AccountUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Account>;
export declare const getUpdateAccountMutationKey: () => readonly ["updateAccount"];
export declare const getUpdateAccountMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, UpdateAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, UpdateAccountMutationVariables, TContext>;
export type UpdateAccountMutationResult = NonNullable<Awaited<ReturnType<typeof updateAccount>>>;
export type UpdateAccountMutationBody = BodyType<AccountUpdate>;
export type UpdateAccountMutationError = ErrorType<void>;
export type UpdateAccountMutationVariables = {
    accountNumber: string;
    data: BodyType<AccountUpdate>;
};
/**
* @summary Update the current account
*/
export declare const useUpdateAccount: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccount>>, TError, UpdateAccountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAccount>>, TError, UpdateAccountMutationVariables, TContext>;
export declare const getListAccountsUrl: () => string;
/**
 * @summary List all assistant accounts
 */
export declare const listAccounts: (options?: Parameters<typeof customFetch>[1]) => Promise<Account[]>;
export declare const getListAccountsQueryKey: () => readonly ["/api/admin/accounts"];
export declare const getListAccountsQueryOptions: <TData = Awaited<ReturnType<typeof listAccounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAccountsQueryResult = NonNullable<Awaited<ReturnType<typeof listAccounts>>>;
export type ListAccountsQueryError = ErrorType<unknown>;
/**
 * @summary List all assistant accounts
 */
export declare function useListAccounts<TData = Awaited<ReturnType<typeof listAccounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAccounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAccountAccessUrl: (accountNumber: string) => string;
/**
 * @summary Change Premium or account role
 */
export declare const updateAccountAccess: (accountNumber: string, accountAccessUpdate: AccountAccessUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Account>;
export declare const getUpdateAccountAccessMutationKey: () => readonly ["updateAccountAccess"];
export declare const getUpdateAccountAccessMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccountAccess>>, TError, UpdateAccountAccessMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAccountAccess>>, TError, UpdateAccountAccessMutationVariables, TContext>;
export type UpdateAccountAccessMutationResult = NonNullable<Awaited<ReturnType<typeof updateAccountAccess>>>;
export type UpdateAccountAccessMutationBody = BodyType<AccountAccessUpdate>;
export type UpdateAccountAccessMutationError = ErrorType<void>;
export type UpdateAccountAccessMutationVariables = {
    accountNumber: string;
    data: BodyType<AccountAccessUpdate>;
};
/**
* @summary Change Premium or account role
*/
export declare const useUpdateAccountAccess: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAccountAccess>>, TError, UpdateAccountAccessMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAccountAccess>>, TError, UpdateAccountAccessMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map