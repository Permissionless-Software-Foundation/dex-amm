/*
  Unit tests for the src/use-cases/order.js business logic library.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local libraries
import OrderUseCases from '../../../src/use-cases/order.js'
import adapters from '../mocks/adapters/index.js'

describe('#order-use-case', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new OrderUseCases({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new OrderUseCases()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Order Use Cases library.'
        )
      }
    })
  })

  describe('#convertUsdToSats', () => {
    it('should convert a USD price to sats', () => {
      const usdPerBch = 111.0
      const idealOrder = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        qty: 1,
        pricePerToken: 0.01,
        errorPercent: 0.02,
        markup: 0
      }

      const result = uut.convertUsdToSats(usdPerBch, idealOrder)
      // console.log('result: ', result)

      assert.equal(result, 9009)
    })

    it('should catch, report, and throw an error', () => {
      try {
        // Force an error.
        sandbox.stub(uut.wallet.bchjs.Util, 'floor8').throws(new Error('test error'))

        const usdPerBch = 111.0
        const idealOrder = {
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
          qty: 1,
          pricePerToken: 0.01,
          errorPercent: 0.02,
          markup: 0
        }

        uut.convertUsdToSats(usdPerBch, idealOrder)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#createOrder', () => {
    it('should create an order', async () => {
      const orderDetails = {
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        qty: 0.1,
        pricePerToken: 0.01,
        errorPercent: 0.02,
        markup: 0,
        idealSatPrice: 903
      }

      // Mock dependencies and force desired code path.
      sandbox.stub(uut.adapters.dex, 'createOrder').resolves({ hash: 'fakeHash' })

      const result = await uut.createOrder(orderDetails)

      assert.equal(result, 'fakeHash')
    })

    it('should catch, report, and throw an error', async () => {
      try {
        // Mock dependencies and force desired code path.
        sandbox.stub(uut.adapters.dex, 'createOrder').rejects(new Error('test error'))

        await uut.createOrder()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Cannot read')
      }
    })
  })

  describe('#checkOrders', () => {
    it('should create a new order if it does not exist', async () => {
      // Input data
      const idealOrders =
        [{
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
          qty: 1,
          pricePerToken: 0.01,
          errorPercent: 0.02,
          markup: 0
        }]
      const existingOrders = []

      // Mock dependencies and force desired code path.
      sandbox.stub(uut.adapters.jsonFiles, 'readJSON').resolves(idealOrders)
      sandbox.stub(uut.adapters.dex, 'getOrders').resolves(existingOrders)
      sandbox.stub(uut.wallet, 'getUsd').resolves(111)
      sandbox.stub(uut, 'createOrder').resolves('fakeHash')

      const result = await uut.checkOrders()
      // console.log('result: ', result)

      assert.equal(result, 'fakeHash')
    })

    it('should delete and recreate order if outside price tolerances', async () => {
      // Input data
      const idealOrders =
        [{
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
          qty: 1,
          pricePerToken: 0.01,
          errorPercent: 0.02,
          markup: 0
        }]
      const existingOrders = [{
        _id: '638a4c42b01e512fdb6bd66b',
        messageType: 1,
        messageClass: 1,
        tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
        buyOrSell: 'sell',
        rateInBaseUnit: '9034',
        minUnitsToExchange: '9034',
        numTokens: 1,
        makerAddr: 'bitcoincash:qq04t0jhllzztrh2ypxy88ujff5wqv0kpgra2gt40d',
        ticker: 'TROUT',
        utxoTxid: '3394d5afd8bac0199d91feae795abbab463b69bdc338c8630bbb8d052a12762a',
        utxoVout: 1,
        tokenType: 1,
        hdIndex: 2,
        p2wdbHash: 'zdpuAmSFh4fiDP8znXyUPuZbBajQPmNp7gaVYt7mJHypRxy1m',
        __v: 0
      }]

      // Mock dependencies and force desired code path.
      sandbox.stub(uut.adapters.jsonFiles, 'readJSON').resolves(idealOrders)
      sandbox.stub(uut.adapters.dex, 'getOrders').resolves(existingOrders)
      sandbox.stub(uut.wallet, 'getUsd').resolves(130)
      sandbox.stub(uut.adapters.dex, 'deleteOrder').resolves('fakeTxid')
      sandbox.stub(uut, 'createOrder').resolves('fakeHash')

      const result = await uut.checkOrders()
      // console.log('result: ', result)

      assert.equal(result, 'fakeHash')
    })

    it('should catch, report, and throw an error', async () => {
      try {
        // Mock dependencies and force desired code path.
        sandbox.stub(uut.adapters.jsonFiles, 'readJSON').rejects(new Error('test error'))

        await uut.checkOrders()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
