![Ethereum](https://img.shields.io/badge/Ethereum-181717?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFC107?logo=hardhat&style=for-the-badge&logoColor=black)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-DDDDDD?logo=openzeppelin&style=for-the-badge&logoColor=black)

# Unicoinˣ

## 🌎 Ecosystem's Smart Contracts

**Overview**  
A *token-based Smart Contracts Ecosystem* is the alignment structure of a multilateral set of partners for a defined period of time who, through the active shaping of relationships, pursue a common goal of creating common added value for all actors through a central value proposition with tokens as the value proposition of the ecosystem.

### The usage of tokens as a value of the ecosystem
**Token incentive**: Users of an ecosystem can obtain the necessary tokens to participate in that ecosystem by changing fiat or cryptocurrencies to the respective tokens, or by contributing to the value of the ecosystem, for which they are then rewarded with tokens. Two types of contributions can be distinguished: The first is the active work for the platform economy, for example recommending the platform to new customers, the second is the sharing or disclosing of own data.

**Token purpose/type**: Depending on the purpose of tokens, they have a significant impact on the success of a platform ecosystem. On the one side, there are usage tokens that allow owners to use a service offered by the platform (also named as a utility token). Thus, if a user wants to participate in the development of or work on the platform, he needs the usage tokens. The funding tokens, on the other side, are only relevant for fund raising, and the staking tokens finally enable platform participants to acquire rights as stakeholders.
### 📢 Updates
- `Version 1.0.1` (Sep-12-2024)
    * Public Repo
        + [GitHub](https://github.com/) 
    * Ethereum Mainnet Deployments
        + [UNCNToken.sol](https://etherscan.io/tx/0xf47e51cee3f378ac7bcc5284f0b10c10c0a2755c6019fb101f42b351b165bf02)
        + [uToken.sol](https://etherscan.io/tx/0xcf3440e605b2170ed109422c72c7f35dd52671f40c5ff4ca3f581a58ec80140a)

### 📁 Directory structure
Meets the Hardhat v2.22.x smart contracts boilerplate directory structure.

- **contracts/**: Stores all Solidity smart contracts.
- **scripts/**: Contains scripts to deploy and interact with contracts.
- **test/**: Test files for each contract.
- **hardhat.config.js**: Main configuration file for Hardhat with the network configurations, Solidity compiler versions, and plugins.
- **.env**: A file for storing sensitive information like API keys and private keys. Make sure to add it to `.gitignore` to keep it private.
- **package.json**: Project dependencies and scripts for running tests, compilation, etc.

### 🔏 Smart Contracts `ERC20`

#### uToken
*contracts/uToken.sol*  
  
`Unicoinˣ Open Token` pattern implementation designed for the Uniconˣ DeFi. Implements ERC20 standard common methods.

#### UNCNToken
*contracts/UNCNToken.sol*  
  
`Unicoinˣ Utility Token` pattern implementation designed for the Unicoinˣ DOA. Implements ERC20 standard common methods.  
Implements pausable pattern for emergency Ecosystem DOA blocking by the contract owner.

### ✅ Tests
1. **Run All Tests**  
   Use the following command to run all test files in the `test` directory:
   ```bash
   npx hardhat test
   ```
   This command automatically detects and executes all `.js` or `.ts` files within the `test` folder.

2. **Run Specific Tests**  
   To execute a specific test file, specify the filename in the command:
   ```bash
   npx hardhat test test/{contract_name}.test.ts
   ```
   Replace `{contract_name}` with the name of the contract you wish to test.

3. **Additional Options**  
   Run tests with a custom command to specify a particular contract:
   ```bash
   npx hardhat test-contract --contract {your_contract_name}
   ```
   Replace `{your_contract_name}` with the name of your contract.

## 🌎 Unicoinˣ Open Token Pattern

**Overview**  
The `Unicoinˣ Open Token` pattern is a streamlined and gas-efficient implementation of the ERC20 token standard, designed specifically for the `Unicoinˣ Ecosystem` in decentralized finance (DeFi).  
This token structure reduces customer transaction costs by minimizing unnecessary operations often associated with traditional ERC20 implementations, such as whitelist/blacklist checks and additional execution calls during transfer and approval actions.

### ✨ Key Features
1. **ERC20 Standard Compatibility**  
    Fully compliant with the ERC20 standard, ensuring compatibility across a wide range of DeFi protocols, exchanges, and Ethereum-based wallets. 

2. **Optimized for Cost Efficiency**  
    Traditional ERC20 tokens often incur additional gas fees for every transaction due to extra logic, including:
    - Whitelisting/blacklisting checks
    - Enhanced authorization and approval layers
    - Repeated external calls and fallback functions

    By streamlining these processes, the Unicoinˣ Open Token significantly reduces gas consumption, leading to lower transaction fees on Ethereum and Ethereum-compatible networks.  
    This efficiency makes it an ideal choice for high-frequency users and DeFi projects that prioritize cost savings for their users.

3. **Simplified Execution Model**  
    This pattern avoids the need for extra EVM calls during token transfers and approvals. This streamlined approach eliminates the additional computational loads  

The result is faster and more cost-effective token interactions without compromising security or ERC20 compliance.

### 💡 Use Cases

The `Unicoinˣ Open Token` pattern is ideal for:  

- **DeFi Protocols**: Optimized for platforms requiring high transaction throughput with minimal fees, such as lending and borrowing protocols, decentralized exchanges, and yield farming projects.
- **Ethereum-based Networks**: Provides cost savings on Ethereum and compatible networks where transaction fees are directly impacted by gas consumption.
- **High-Frequency Traders**: Ideal for users who frequently interact with DeFi protocols and would benefit from minimized transaction costs.

### 🚀 Benefits for the Unicoinˣ Ecosystem

The Unicoinˣ Open Token pattern offers several benefits to users within the Unicoinˣ Ecosystem:  

- **Lower Transaction Costs**: By reducing additional executions, this token pattern cuts down on transaction fees.
- **Efficient Network Utilization**: Reduces the computational load on the Ethereum network, contributing to faster transaction processing.
- **User-Friendly**: Simplified interactions improve the experience for users, especially those interacting with DeFi protocols frequently.

**Note**: Unicoinˣ token design approach aligns with best practices for Ethereum-based token implementations, offering a balance between compliance with established standards and innovations that reduce costs for end-users.

## 🌎 Unicoinˣ Utility Token Pattern

**Overview**  
The `UNCNToken` contract is an ERC20-compliant utility token developed specifically for the `Unicoinˣ Ecosystem DAO`. This token provides standard token functionality, with the addition of a **Pausable** pattern to enhance security and control, allowing the contract owner to halt token in emergency scenarios.  
This feature aligns with best practices in decentralized governance, adding a layer of protection for the DAO's assets and ensuring stability during critical events.

### ✨ Key Features

1. **ERC20 Standard Compliance**  
    The `UNCNToken` adheres fully to the ERC20 standard, ensuring interoperability across decentralized finance (DeFi) platforms, exchanges, and Ethereum-compatible wallets. It implements key ERC20 methods—such as `transfer`, `approve`, and `transferFrom`—to allow seamless token operations in various DeFi and DAO applications.

2. **Pausable Pattern for Emergency Control**  
    To support emergency management in the DAO Ecosystem, `UNCNToken` incorporates the Pausable pattern. This feature allows the contract owner to pause token transfers and approvals temporarily in cases of unexpected risks or security threats. The pausability functionality:
    - Enables quick action to block transfers in case of identified vulnerabilities.
    - Adds an essential layer of protection, which can be particularly useful in the high-stakes DeFi and DAO environments.
    - Ensures that normal operations can be safely resumed once issues are resolved.

3. **Secure DAO Integration**  
    Designed specifically for DAO use cases, `UNCNToken` prioritizes secure, community-driven governance while allowing responsive actions from the contract owner to safeguard the ecosystem. This dual structure supports effective management while maintaining transparency and security.

### 💡 Use Cases

The `UNCNToken` pattern is particularly suited for:  

- **DAO Governance Tokens**: With the added pausability feature, `UNCNToken` serves as a reliable asset for governance-based organizations, providing security measures without compromising on standard functionality.
- **DeFi Protocols with Emergency Controls**: Ideal for DeFi platforms that require an emergency halt function for token operations in cases of potential breaches or unexpected market conditions.
- **Ecosystem Tokens in High-Risk Environments**: Provides additional security by giving the contract owner an emergency pause option, suitable for high-stakes DeFi projects where safeguarding user assets is paramount.

### 🚀 Benefits for the Unicoinˣ Ecosystem DAO

The `UNCNToken` pattern offers significant advantages to the DAO Ecosystem:  

- **Enhanced Security**: The Pausable pattern allows the contract owner to respond to emergencies, safeguarding the ecosystem and user assets during critical situations.
- **Controlled Risk Management**: With the pausability functionality, risk can be managed effectively without disrupting standard operations, allowing for a rapid response to security threats.
- **ERC20 Compliance**: Ensures compatibility across DeFi platforms and applications, making it easy to integrate with the broader Ethereum ecosystem.

**Note**: The design of `UNCNToken` combines the ERC20 standard with an emergency management system, enhancing both usability and security for the DAO Ecosystem. This pattern aligns with DAO governance principles, offering flexibility for emergencies while supporting community-driven operations.

 
## 📧 Contact us
- **Supporting Email**: [support@unicoinx.io](mailto:support@unicoinx.io)
- **Abuse and Scam Reports**: [abuse@unicoinx.io](mailto:abuse@unicoinx.io)
- **Unicoinˣ Ecosystem** [https://unicoinx.io](https://unicoinx.io)
- **Unicoin**: [https://unicoin.com](https://unicoin.com)
- **Unicoin International**: [https://unicoin.global](https://unicoin.global)

***
[Privacy Policy](https://unicoin.com/privacy) | [Terms of Service](https://unicoin.com/terms) | [Risks](https://unicoin.com/risks)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Unicoinx-io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/unicoins/)
[![X](https://img.shields.io/badge/Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/Unicoin_News)

© 2024 Unicoin International. All rights reserved.