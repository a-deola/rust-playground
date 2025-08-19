import {
  PollanaAccount,
  getCloseInstruction,
  getPollanaProgramAccounts,
  getPollanaProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function usePollanaProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getPollanaProgramId(cluster.id), [cluster])
}

export function usePollanaProgram() {
  const { client, cluster } = useWalletUi()
  const programId = usePollanaProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function usePollanaInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const pollana = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, pollana }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['pollana', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function usePollanaDecrementMutation({ pollana }: { pollana: PollanaAccount }) {
  const invalidateAccounts = usePollanaAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ pollana: pollana.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function usePollanaIncrementMutation({ pollana }: { pollana: PollanaAccount }) {
  const invalidateAccounts = usePollanaAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ pollana: pollana.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function usePollanaSetMutation({ pollana }: { pollana: PollanaAccount }) {
  const invalidateAccounts = usePollanaAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          pollana: pollana.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function usePollanaCloseMutation({ pollana }: { pollana: PollanaAccount }) {
  const invalidateAccounts = usePollanaAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, pollana: pollana.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function usePollanaAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: usePollanaAccountsQueryKey(),
    queryFn: async () => await getPollanaProgramAccounts(client.rpc),
  })
}

function usePollanaAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = usePollanaAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function usePollanaAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['pollana', 'accounts', { cluster }]
}
