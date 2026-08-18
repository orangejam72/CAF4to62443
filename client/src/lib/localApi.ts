/**
 * Drop-in replacement for the original tRPC client.
 *
 * The original app talked to an Express + tRPC backend. This module keeps the
 * exact same call shape (`api.inventory.list.useQuery()`,
 * `api.inventory.create.useMutation()`) but resolves everything against
 * browser-local storage, so the page components barely changed.
 *
 * Everything is synchronous under the hood; the mutation helpers stay async to
 * preserve the original `await mutation.mutateAsync(...)` call sites.
 */

import { useCallback, useState, useSyncExternalStore } from "react";
import * as store from "./localStore";
import type { InventoryItem, ComplianceAssessment, NewInventoryItem } from "./localStore";
import { performGapAnalysis, type GapAnalysisResult } from "./gapAnalysis";

/** Re-render whenever the store changes. */
function useStoreRevision(): number {
  return useSyncExternalStore(store.subscribe, store.getRevision, store.getRevision);
}

interface QueryResult<T> {
  data: T;
  refetch: () => void;
  isLoading: false;
}

function useQueryLike<T>(select: () => T): QueryResult<T> {
  useStoreRevision();
  const [, force] = useState(0);
  const refetch = useCallback(() => force((n) => n + 1), []);
  return { data: select(), refetch, isLoading: false };
}

interface MutationResult<TInput, TOutput> {
  mutateAsync: (input: TInput) => Promise<TOutput>;
  mutate: (input: TInput) => void;
  isPending: boolean;
}

function useMutationLike<TInput, TOutput>(
  fn: (input: TInput) => TOutput
): MutationResult<TInput, TOutput> {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (input: TInput) => {
      setIsPending(true);
      try {
        return fn(input);
      } finally {
        setIsPending(false);
      }
    },
    [fn]
  );

  const mutate = useCallback(
    (input: TInput) => {
      void mutateAsync(input);
    },
    [mutateAsync]
  );

  return { mutateAsync, mutate, isPending };
}

export interface AnalyzeInput {
  inventoryIds: number[];
  assessmentName: string;
  description?: string;
}

export const api = {
  inventory: {
    list: {
      useQuery: (): QueryResult<InventoryItem[]> => useQueryLike(store.listInventory),
    },
    create: {
      useMutation: () =>
        useMutationLike((input: NewInventoryItem) => store.createInventoryItem(input)),
    },
    update: {
      useMutation: () =>
        useMutationLike((input: { id: number } & Partial<NewInventoryItem>) => {
          const { id, ...patch } = input;
          return store.updateInventoryItem(id, patch);
        }),
    },
    delete: {
      useMutation: () =>
        useMutationLike((input: { id: number }) => store.deleteInventoryItem(input.id)),
    },
  },

  assessment: {
    list: {
      useQuery: (): QueryResult<ComplianceAssessment[]> =>
        useQueryLike(store.listAssessments),
    },
    analyze: {
      useMutation: () =>
        useMutationLike((input: AnalyzeInput): GapAnalysisResult => {
          const selected = store
            .listInventory()
            .filter((item) => input.inventoryIds.includes(item.id));

          const result = performGapAnalysis(selected);

          store.createAssessment({
            assessmentName: input.assessmentName,
            description: input.description,
            totalControls: result.totalControls,
            implementedControls: result.implementedControls,
            partiallyImplementedControls: result.partiallyImplementedControls,
            notImplementedControls: result.notImplementedControls,
            compliancePercentage: result.compliancePercentage,
            gapAnalysisData: JSON.stringify(result),
            inventoryIds: JSON.stringify(input.inventoryIds),
          });

          return result;
        }),
    },
  },
};

export default api;
