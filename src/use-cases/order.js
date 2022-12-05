/*
  This use-case library is used to manage orders.
*/

import SlpWallet from 'minimal-slp-wallet'

class OrderUseCases {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Order Use Cases library.'
      )
    }

    this.wallet = new SlpWallet(undefined, {
      interface: 'consumer-api'
    })
  }

  // Check each order maintained by the DEX and bring them into alignment with
  // the JSON file of desired orders to maintain.
  // It's important that this function is called less frequently than it takes
  // to generate a new order, so that multiple calls don't step on top of one
  // another.
  // This function is also designed to exit after creating a single order. It's
  // intentially slow to create new orders.
  async checkOrders () {
    try {
      // Read the order list from the JSON file.
      const idealOrders = await this.adapters.jsonFiles.readJSON('./orders.json')
      console.log('idealOrders: ', idealOrders)

      const existingOrders = await this.adapters.dex.getOrders()
      console.log('existingOrders: ', existingOrders)

      // Get the USD/BCH price.
      const usdPerBch = await this.wallet.getUsd()
      console.log('usdPerBch: ', usdPerBch)

      let hash = ''

      // Loop through the ideal Orders and try to find an existing Order that matches.
      for (let i = 0; i < idealOrders.length; i++) {
        const thisIdealOrder = idealOrders[i]

        let matchFound = false

        // Loop through the existing orders.
        for (let j = 0; j < existingOrders.length; j++) {
          const thisExistingOrder = existingOrders[j]

          const tokenIdMatches = thisExistingOrder.tokenId === thisIdealOrder.tokenId
          const qtyMatches = thisExistingOrder.numTokens === thisIdealOrder.qty

          if (tokenIdMatches && qtyMatches) {
            // If we've found a match, save it to the variable and exit the inner loop.
            matchFound = thisExistingOrder
            break
          }
        }

        const idealSatPrice = this.convertUsdToSats(usdPerBch, thisIdealOrder)

        // Measure the tolerance thresholds.
        const highThresh = idealSatPrice * (1 + thisIdealOrder.errorPercent)
        // const highThresh = idealSatPricePerToken
        const lowThresh = idealSatPrice * (1 - thisIdealOrder.errorPercent)
        // const lowThresh = idealSatPricePerToken

        if (matchFound) {
          const existingPriceInSats = parseInt(matchFound.minUnitsToExchange)
          console.log('existingPriceInSats: ', existingPriceInSats)

          // If the price is not within tolerance
          if (existingPriceInSats > highThresh || existingPriceInSats < lowThresh) {
            console.log(`Order of ${existingPriceInSats} sats is outside tolerance of ideal price of ${idealSatPrice} sats. Recreating order.`)

            // Delete the Order
            const p2wdbHash = matchFound.p2wdbHash
            console.log(`Deleting existing order with P2WDB hash: ${p2wdbHash}`)
            const result = await this.adapters.dex.deleteOrder(p2wdbHash)
            console.log('result: ', result)

            // Create a new Order
            console.log('Creating a new Order.')
            thisIdealOrder.idealSatPrice = idealSatPrice
            hash = await this.createOrder(thisIdealOrder)

            break
          }
          console.log('Existing Order within price tolerance.')
        } else {
          console.log('Creating a new Order.')

          // Match not found, create a new order.
          thisIdealOrder.idealSatPrice = idealSatPrice
          hash = await this.createOrder(thisIdealOrder)

          break
        }
      }

      return hash
    } catch (err) {
      console.error('Error in use-cases/order/checkOrders()')
      throw err
    }
  }

  // This function takes in a USD dollar amount and returns the same value
  // calculated at satoshis.
  // The behind this function is that is can be swapped out with more sophisticated
  // functions if more sophisticated dollar calculations are required.
  convertUsdToSats (usdPerBch, idealOrder) {
    try {
      const bchjs = this.wallet.bchjs

      // Calculate the ideal price per token in sats.
      const idealBchPrice = bchjs.Util.floor8(idealOrder.pricePerToken / usdPerBch)
      console.log('idealBchPrice: ', idealBchPrice)

      const idealSatPrice = bchjs.BitcoinCash.toSatoshi(idealBchPrice)
      console.log('idealSatPrice: ', idealSatPrice)

      return idealSatPrice
    } catch (err) {
      console.error('Error in convertUsdToSats()')
      throw err
    }
  }

  // Create a new order
  async createOrder (orderDetails) {
    try {
      console.log('orderDetails: ', orderDetails)

      const orderObj = {
        lokadId: 'SWP',
        messageType: 1,
        messageClass: 1,
        tokenId: orderDetails.tokenId,
        buyOrSell: 'sell',
        rateInBaseUnit: orderDetails.idealSatPrice,
        minUnitsToExchange: orderDetails.idealSatPrice * orderDetails.qty,
        numTokens: orderDetails.qty
      }

      const result = await this.adapters.dex.createOrder(orderObj)
      // console.log('use-cases/order/createOrder() result: ', result)

      return result.hash
    } catch (err) {
      console.error('Error in use-cases/order/createOrder()')
      throw err
    }
  }
}

export default OrderUseCases
