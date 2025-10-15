'use client'

import { useCheckout } from 'mdk-checkout';

export default function Home() {
  const { navigate, isNavigating } = useCheckout({
    esploraUrl: 'https://mutinynet.com/api',
    lspAddress: "3.21.138.98:9735",
    lspNodeId: "03fd9a377576df94cc7e458471c43c400630655083dee89df66c6ad38d1b7acffd",
    vssUrl: "https://vss.staging.moneydevkit.com/vss",
    network: "signet",
    rgsUrl: "https://rgs.mutinynet.com/snapshot",
    baseUrl: "https://staging.moneydevkit.com/rpc",
  });

  const handlePurchase = (jokeType, amount, prompt) => {
    navigate({
      prompt: prompt,
      amount: amount,
      currency: 'USD',
      metadata: {
        type: jokeType,
        successUrl: `/checkout/success?type=${jokeType}`
      }
    })
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>

      <main className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
            The Joke is So Funny it's Paywalled
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Premium humor for the discerning comedy connoisseur.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto flex-1 max-h-96">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col">
            <div className="text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 text-cyan-400">A Joke</h3>
                <div className="text-3xl font-bold mb-4 text-white">$2.99</div>
                <p className="text-gray-400 text-sm mb-6">
                  Entry-level humor. Perfect for casual chuckles.
                </p>
              </div>
              <button
                onClick={() => handlePurchase('basic', 299, 'A Joke - Entry-level humor')}
                disabled={isNavigating}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Creating checkout...' : 'Buy Joke'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-800/80 to-purple-900/80 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl p-6 hover:border-purple-400/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              POPULAR
            </div>
            <div className="text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">Funnier Joke</h3>
                <div className="text-3xl font-bold mb-4 text-white">$5.99</div>
                <p className="text-gray-400 text-sm mb-6">
                  Mid-tier comedy gold. Guaranteed genuine laughter.
                </p>
              </div>
              <button
                onClick={() => handlePurchase('premium', 599, 'Funnier Joke - Mid-tier comedy gold')}
                disabled={isNavigating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Creating checkout...' : 'Buy Joke'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-700/20 backdrop-blur-sm border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-400/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
            <div className="text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Funniest Joke</h3>
                <div className="text-3xl font-bold mb-4 text-white">$9.99</div>
                <p className="text-gray-400 text-sm mb-6">
                  Elite comedy experience. Uncontrollable laughter guaranteed.
                </p>
              </div>
              <button
                onClick={() => handlePurchase('elite', 999, 'Funniest Joke - Elite comedy experience')}
                disabled={isNavigating}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Creating checkout...' : 'Buy Joke'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            All jokes digitally delivered. Laughter guaranteed or your money back.*
          </p>
          <p className="text-gray-500 text-xs mt-1">
            *Terms apply. Side effects may include happiness.
          </p>
        </div>
      </main>
    </div>
  );
}
