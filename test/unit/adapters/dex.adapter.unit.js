/*
  Unit tests for the dex.js adapter library.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local libraries
import DexAdapter from '../../../src/adapters/dex.js'

describe('#dex-adapter', () => {
  let uut
  let sandbox

  beforeEach(() => {
    uut = new DexAdapter()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#getOrders', () => {
    it('should get orders', async () => {
      // Mock dependencies and force desired code path.
      sandbox.stub(uut.axios, 'get').resolves({ data: 'fakeData' })

      const result = await uut.getOrders()

      assert.equal(result, 'fakeData')
    })

    it('should catch, report, and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.axios, 'get').rejects(new Error('test error'))

        await uut.getOrders()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })
  })

  describe('#createOrder', () => {
    it('should get orders', async () => {
      // Mock dependencies and force desired code path.
      sandbox.stub(uut.axios, 'post').resolves({ data: 'fakeData' })

      const result = await uut.createOrder()

      assert.equal(result, 'fakeData')
    })

    it('should catch, report, and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

        await uut.createOrder()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })
  })

  describe('#deleteOrder', () => {
    it('should get orders', async () => {
      // Mock dependencies and force desired code path.
      sandbox.stub(uut.axios, 'post').resolves({ data: 'fakeData' })

      const result = await uut.deleteOrder()

      assert.equal(result, 'fakeData')
    })

    it('should catch, report, and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut.axios, 'post').rejects(new Error('test error'))

        await uut.deleteOrder()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.equal(err.message, 'test error')
      }
    })
  })
})
