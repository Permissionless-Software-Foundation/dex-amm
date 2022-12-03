# dex-amm Specifications

This document contains a high-level, human-readable specification for the four major architectural areas of the bch-dex:

- Entities
- Use Cases
- Controllers (inputs)
- Adapters (outputs)

This reflects the [Clean Architecture](https://bafybeiajggd4zju7oen627bcy5l32hrxqomoqzvwqfir6phzgducozksv4.ipfs.dweb.link/blog/clean-architecture) design pattern.

## Entities
No entities are coded for this application.

## Use Cases
Use cases are the business logic that is applied by leverage Adapters. Most Use Cases are triggered by Controllers.

### Order
The Order Use Case library is concerned with monitoring and working with Orders.

## Controllers
Controllers are the inputs to the system. These are an API that causes the app to react when the controller is activated.

### Timer Controllers
The Time Controller library contains a single `checkOrders()` command that is triggered every 5 minutes. This compares existing Orders to the JSON file of ideal orders. It will add and delete orders in order to maintain the ideal Orders within the specified price range.

## Adapters
Adapters are outputs of the system, and also middleware for interfacing to external systems.

### JSON File Handling
This adapter is able to read in a JSON file containing desired orders to maintain with the DEX.

### DEX
This library is called by the Order Use Case library. They contain code for making REST API calls to the DEX, in order to work with Orders.
