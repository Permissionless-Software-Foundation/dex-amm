/*
  This Controller library is concerned with timer-based functions that are
  kicked off periodicially.
*/

class TimerControllers {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Timer Controller libraries.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Timer Controller libraries.'
      )
    }

    this.debugLevel = localConfig.debugLevel

    // Bind 'this' object to all subfunctions.
    this.checkOrders = this.checkOrders.bind(this)

    // State
    this.state = {
      checkOrdersHasFinished: true
    }

    this.startTimers()
  }

  // Start all the time-based controllers.
  startTimers () {
    this.checkOrderHandle = setInterval(this.checkOrders, 60000 * 10)
    // setTimeout(this.checkOrders, 60000 * 0.5)
  }

  stopTimers () {
    clearInterval(this.checkOrderHandle)
  }

  async checkOrders () {
    try {
      // Exit if the previous call has not finshed.
      if (!this.state.checkOrdersHasFinished) return

      // Disable the timer interval while this function runs.
      this.state.checkOrdersHasFinished = false
      clearInterval(this.checkOrderHandle)

      console.log('checkOrders() timer controller fired')
      // console.log('this.useCases: ', this.useCases)

      const hash = await this.useCases.order.checkOrders()

      // Renable this timer interval
      this.state.checkOrdersHasFinished = true
      this.checkOrderHandle = setInterval(this.checkOrders, 60000 * 10)

      return hash
    } catch (err) {
      // Do not throw an error. This is a top-level function.
      console.log('Error in timer-controllers.js/checkOrders(): ', err)

      // Renable this timer interval
      this.state.checkOrdersHasFinished = true
      this.checkOrderHandle = setInterval(this.checkOrders, 60000 * 10)

      return false
    }
  }
}

export default TimerControllers
