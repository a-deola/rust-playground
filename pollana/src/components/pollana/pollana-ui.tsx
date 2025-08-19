import { ellipsify } from '@wallet-ui/react'
import {
  usePollanaAccountsQuery,
  usePollanaCloseMutation,
  usePollanaDecrementMutation,
  usePollanaIncrementMutation,
  usePollanaInitializeMutation,
  usePollanaProgram,
  usePollanaProgramId,
  usePollanaSetMutation,
} from './pollana-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { PollanaAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function PollanaProgramExplorerLink() {
  const programId = usePollanaProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function PollanaList() {
  const pollanaAccountsQuery = usePollanaAccountsQuery()

  if (pollanaAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!pollanaAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {pollanaAccountsQuery.data?.map((pollana) => (
        <PollanaCard key={pollana.address} pollana={pollana} />
      ))}
    </div>
  )
}

export function PollanaProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = usePollanaProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function PollanaCard({ pollana }: { pollana: PollanaAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollana: {pollana.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={pollana.address} label={ellipsify(pollana.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <PollanaButtonIncrement pollana={pollana} />
          <PollanaButtonSet pollana={pollana} />
          <PollanaButtonDecrement pollana={pollana} />
          <PollanaButtonClose pollana={pollana} />
        </div>
      </CardContent>
    </Card>
  )
}

export function PollanaButtonInitialize() {
  const mutationInitialize = usePollanaInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Pollana {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function PollanaButtonIncrement({ pollana }: { pollana: PollanaAccount }) {
  const incrementMutation = usePollanaIncrementMutation({ pollana })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function PollanaButtonSet({ pollana }: { pollana: PollanaAccount }) {
  const setMutation = usePollanaSetMutation({ pollana })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', pollana.data.count.toString() ?? '0')
        if (!value || parseInt(value) === pollana.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function PollanaButtonDecrement({ pollana }: { pollana: PollanaAccount }) {
  const decrementMutation = usePollanaDecrementMutation({ pollana })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function PollanaButtonClose({ pollana }: { pollana: PollanaAccount }) {
  const closeMutation = usePollanaCloseMutation({ pollana })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
