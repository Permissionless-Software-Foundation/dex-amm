# dex-amm

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Overview

This is an automated market maker (AMM) for the [PSF DEX](https://dex.fullstack.cash). Operators can specify the tokens they want to sell, the quantities they want to sell, and the prices they want to sell at, in a JSON file. This app then reads that JSON file and maintains inventory on the DEX.

This AMM app will only work if the [DEX Seller Software](https://bch-dex-docs.fullstack.cash/usage/seller-wallet) is fully operational. It uses the REST API to instruct the DEX software to create and delete orders.

## Documentation
This app is currently under active development. For developers who want to follow progress or contribute, start by reading the [Developer Documentation](./dev-docs)

## Requirements

This software assumes it will be run on an Ubuntu Linux operating system, using Docker and Docker Compose.

- node **v16**
- npm **v9**
- Docker **v20.10.8**
- Docker Compose **v1.27.4**

## Installation

- Setup the DEX Seller software. See [this documentation](https://bch-dex-docs.fullstack.cash/usage/seller-wallet) for directions.
- Create an `order.json` file in the root folder of this repository (see below).
- Navigate to the `production/docker` directory.
- Pull down the docker image with `docker-compose pull`
- Start the docker container with `docker-compose up -d`

## `orders.json`

Here is an example of an `orders.json` file that instructs the AMM to maintain orders for a single token in the following quantities: 0.1, 1, and 2 tokens. The price for the token is set to $0.01 USD. If the price deviates by more than 5%, the AMM will delete the existing Order and recreate a new Order at the current price.

```json
[
  {
    "tokenId": "a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2",
    "qty": 0.1,
    "pricePerToken": 0.01,
    "errorPercent": 0.02,
    "markup": 0.00,
    "priceAlgo": false
  },
  {
    "tokenId": "a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2",
    "qty": 1,
    "pricePerToken": 0.01,
    "errorPercent": 0.02,
    "markup": 0.00,
    "priceAlgo": false
  },
  {
    "tokenId": "a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2",
    "qty": 2,
    "pricePerToken": 0.01,
    "errorPercent": 0.02,
    "markup": 0.00,
    "priceAlgo": false
  }
]
```


## License

[MIT](./LICENSE.md)
