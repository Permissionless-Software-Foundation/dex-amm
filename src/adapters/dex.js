/*
  This adapter contains functions for making REST API calls to the PSF DEX.
*/

// Public npm libraries.
import axios from 'axios'

// Local libraries
import config from '../../config/index.js'

class DexAdapter {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.axios = axios
    this.config = config
  }

  async getOrders () {
    try {
      const result = await axios.get(`${this.config.dexUrl}/order/list/all/0`)

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/getOrders()')
      throw err
    }
  }

  async createOrder (orderObj) {
    try {
      const result = await axios.post(`${this.config.dexUrl}/order/`, { order: orderObj })

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/createOrder()')
      throw err
    }
  }

  async deleteOrder (p2wdbHash) {
    try {
      const result = await axios.post(`${this.config.dexUrl}/order/delete`, { p2wdbHash })

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/createOrder()')
      throw err
    }
  }
}

export default DexAdapter
