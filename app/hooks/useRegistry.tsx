// hooks/useRegistry.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';
import { useWallet } from './useWallet';
import { CreateAssetParams, AssetQuery } from '../common/types';
import { MockAssetRegistry } from '../registry/MockAssetRegistry';

// Keep it simple - just use mock for now
const registry = new MockAssetRegistry();

export function useRegistry() {
    const wallet = useWallet();

    useEffect(() => {
        if (wallet.address) {
            registry.connect({ getAddress: async () => wallet.address! });
        } else {
            registry.disconnect();
        }
    }, [wallet.address]);

    return {
        registry,
        ...wallet,
        isConnected: !!wallet.address,
    };
}

export function useAsset(cid: string | null) {
    const { registry, isConnected } = useRegistry();

    return useQuery({
        queryKey: ['asset', cid],
        queryFn: () => registry.getAsset(cid!),
        enabled: !!cid && isConnected,
    });
}

export function useAssets(query?: AssetQuery) {
    const { registry, isConnected } = useRegistry();

    return useQuery({
        queryKey: ['assets', query],
        queryFn: () => registry.getAssets(query),
        enabled: isConnected,
    });
}

export function useMyAssets() {
    const { registry, isConnected, address } = useRegistry();

    return useQuery({
        queryKey: ['assets', 'creator', address],
        queryFn: () => registry.getAssetsByCreator(address!),
        enabled: !!address && isConnected,
    });
}

export function useHasAccess(cid: string | null) {
    const { registry, isConnected, address } = useRegistry();

    return useQuery({
        queryKey: ['access', cid, address],
        queryFn: () => registry.hasAccess(cid!, address!),
        enabled: !!cid && !!address && isConnected,
    });
}

export function useCreateAsset() {
    const { registry } = useRegistry();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateAssetParams) => registry.createAsset(params),
        onSuccess: (result, params) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['assets'] });
                queryClient.invalidateQueries({ queryKey: ['asset', params.cid] });
            }
        },
    });
}

export function usePurchaseAccess() {
    const { registry, address } = useRegistry();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cid, quantity = 1 }: { cid: string; quantity?: number }) =>
            registry.purchaseAccess(cid, quantity),
        onSuccess: (result, { cid }) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['access', cid, address] });
                queryClient.invalidateQueries({ queryKey: ['asset', cid] });
            }
        },
    });
}