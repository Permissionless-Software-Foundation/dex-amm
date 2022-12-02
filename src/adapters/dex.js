/*
  This adapter contains functions for making REST API calls to the PSF DEX.
*/

// Public npm libraries.
import axios from 'axios'

class DexAdapter {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.axios = axios
  }

  async getOrders () {
    try {
      const result = await axios.get('http://localhost:5700/order/list/all/0')

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/getOrders()')
      throw err
    }
  }

  async createOrder (orderObj) {
    try {
      const result = await axios.post('http://localhost:5700/order/', { order: orderObj })

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/createOrder()')
      throw err
    }
  }

  async deleteOrder (p2wdbHash) {
    try {
      const result = await axios.post('http://localhost:5700/order/delete', { p2wdbHash })

      return result.data
    } catch (err) {
      console.error('Error in adapters/dex.js/createOrder()')
      throw err
    }
  }
}

export default DexAdapter
