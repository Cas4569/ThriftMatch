export default function SignIn() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-14 text-[#171717]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">

        <div className="w-full">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gray-500">
            THRIFTMATCH / BUYERS
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-4 text-gray-600">
            Sign in to discover fashion, save your favourites and build
            your personal style.
          </p>

          <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-black/15 bg-[#f5f1e8] px-5 py-4 outline-none placeholder:text-gray-400 focus:border-[#171717]"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-black/15 bg-[#f5f1e8] px-5 py-4 outline-none placeholder:text-gray-400 focus:border-[#171717]"
              />
            </div>

            <button className="mt-8 w-full rounded-full bg-[#171717] px-6 py-4 font-bold text-white transition hover:scale-[1.02]">
              Sign In →
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <button className="w-full rounded-full border border-[#171717] px-6 py-4 font-semibold transition hover:bg-[#171717] hover:text-white">
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <span className="font-semibold text-[#171717]">
                Create one
              </span>
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}