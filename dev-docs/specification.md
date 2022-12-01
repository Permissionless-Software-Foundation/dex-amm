# dex-amm Specifications

This document contains a high-level, human-readable specification for the four major architectural areas of the bch-dex:

- Entities
- Use Cases
- Controllers (inputs)
- Adapters (outputs)

This reflects the [Clean Architecture](https://bafybeiajggd4zju7oen627bcy5l32hrxqomoqzvwqfir6phzgducozksv4.ipfs.dweb.link/blog/clean-architecture) design pattern.

## Entities

## Use Cases
Use cases are the business logic that is applied by leverage Adapters. Most Use Cases are triggered by Controllers.

### Create Order
This use cases interfaces with the DEX REST API to create new orders. It is triggered by the Order Check Controller to generate a new Order on the DEX.

### Delete Order
This use case interafaces with the DEX REST API to delete an existing order. This is triggered by the Order Check Controller when the price of the underlying asset (BCH or eCash) has changed in price enough that the desired price of the token Order has drifted outside the desired price range.

## Controllers
Controllers are the inputs to the system. These are an API that causes the app to react when the controller is activated.

### Timer Controllers

#### Order Check
This timer controller fires every five minutes. It uses the DEX REST API to query the orders being monitored by the DEX. It compares the existing orders against a JSON file containing the desired orders to be maintained. If there is a mismatch between the two, the orders in the DEX will be adjusted to match the desires in the JSON file.

## Adapters
Adapters are outputs of the system, and also middleware for interfacing to external systems.

### JSON File Handling
This adapter is able to read in a JSON file containing desired orders to maintain with the DEX.

### Price Feed
This is a class of adapters. Any orders involving tokens that are maintained by the AMM, need to have a price feed that ultimately resolves into USD. The USD output of this adapters is used by the system to decide if an order needs to be re-created.
