/*
  This use-case library is used to manage orders.
*/

class OrderUseCases {
  constructor (localConfig = {}) {
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating Order Use Cases library.'
      )
    }
  }

  // Check each order maintained by the DEX and bring them into alignment with
  // the JSON file of desired orders to maintain.
  async checkOrders () {
    try {
      const orders = await this.adapters.dex.getOrders()
      console.log('order: ', orders)
    } catch (err) {
      console.error('Error in use-cases/order/checkOrders()')
      throw err
    }
  }
}

export default OrderUseCases
