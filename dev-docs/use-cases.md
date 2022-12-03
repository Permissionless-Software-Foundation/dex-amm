# Use Cases

This automated market maker (AMM) is designed to cover the following use cases:

- The [PSF](https://psfoundation.cash) wants to sell PSF tokens based on the price feed from the token-liquidity app.
- The PSF wants to sell governance tokens for the price of 1000 PSF tokens.
- A market maker wants to trade BCH and USDt in several denominations and at a percentage above market price.
- A market maker wants to sell a token for a fixed USD price.
- A market maker wants to sell a token for a fixed BCH price.

The `master` branch uses a `orders.json` file to describe *ideal* Orders. These Orders are specified in USD, and the app will convert them to satoshis, the native currency of the DEX. It will maintain the specified Orders within the specified price range.

A `psf` branch will be created, which retrieves the PSF token price from [PSFoundation.cash](https://psfoundation.cash). This branch will be used by the PSF to sell PSF tokens.

A `governance` branch will be created, which sells PSF Governance tokens. These will have a price target of 1,000 PSF tokens.
