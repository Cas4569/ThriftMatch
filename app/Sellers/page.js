export default function Sellers() {
  return (
    <main className="min-h-screen bg-[#120b09] px-6 py-14 text-[#f3e9e5]">
      <div className="mx-auto max-w-3xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#9A6051]">
          THRIFTMATCH / SELLERS
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Become a seller.
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#a9958f]">
          Before you start listing your fashion pieces, we need to verify
          some basic information about you and your store.
        </p>

        <div className="mt-12 rounded-4xl border border-[#3b2925] bg-[#211512] p-8 md:p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-black">
              Seller Verification
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#aaa399]">
              This information helps us keep ThriftMatch safe and
              trustworthy for buyers and sellers.
            </p>
          </div>

          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="Enter your mobile number"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Store Name
              </label>

              <input
                type="text"
                placeholder="Enter your store name"
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Seller Type
              </label>

              <select
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none focus:border-[#9A6051]"
              >
                <option value="">Select seller type</option>
                <option value="individual">Individual Seller</option>
                <option value="thrift-store">Thrift Store</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Social Media / Store Link
              </label>

              <input
                type="url"
                placeholder="Instagram, Facebook, website, etc."
                className="w-full rounded-xl border border-[#624038] bg-[#120b09] px-5 py-4 text-[#f3e9e5] outline-none placeholder:text-[#777168] focus:border-[#9A6051]"
              />
            </div>

          </div>

          <button className="mt-8 w-full rounded-full bg-[#9A6051] px-6 py-4 font-bold text-[#120b09] transition hover:scale-[1.02]">
            Continue Verification →
          </button>

        </div>

      </div>
    </main>
  );
}