export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    missing_code:
      'The sign-in link was incomplete. This can happen if you navigated here directly — please try signing in again.',
    auth_failed:
      'We could not complete sign-in. The link may have expired or already been used. Please try again.',
  }

  const msg =
    errorMessages[searchParams.error ?? ''] ??
    'Something went wrong during sign-in. Please try again.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080910] px-5 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ff9bb5]">
          Sign-in error
        </p>
        <h1 className="mb-4 font-display text-2xl font-bold tracking-tight">
          Couldn&apos;t sign you in
        </h1>
        <p className="mb-8 text-sm leading-7 text-white/55">{msg}</p>
        <a
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.055] px-6 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to home
        </a>
      </div>
    </main>
  )
}
