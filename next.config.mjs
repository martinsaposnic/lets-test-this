import withMdkCheckout from 'mdk-checkout/next-plugin'

const config = {
  experimental: {
    // Allow symlinked deps that live outside this repo (mdk-checkout/lightning-js tree).
    externalDir: true,
  },
  transpilePackages: ['mdk-checkout'],
}

export default withMdkCheckout(config)
