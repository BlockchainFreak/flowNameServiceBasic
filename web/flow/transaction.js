import * as fcl from '@onflow/fcl'

const txPad = (Tx) => ({
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
    ...Tx,
})

export const initAccount = async() => fcl.mutate(txPad({
    cadence: INIT_ACCOUNT,
    limit: 50,
}))

export const registerDomain = async(name, duration) => fcl.mutate(txPad({
    cadence: REGISTER_DOMAIN,
    args: (arg, t) => [arg(name, t.String), arg(duration, t.UFix64)],
}))

export const updateBio = async(nameHash, bio) => fcl.mutate(txPad({
    cadence: UPDATE_BIO_FOR_DOMAIN,
    args: (arg, t) => [arg(nameHash, t.String), arg(bio, t.String)],
}))

export const updateAddress = async(nameHash, addr) => fcl.mutate(txPad({
    cadence: UPDATE_ADDRESS_FOR_DOMAIN,
    args: (arg, t) => [arg(nameHash, t.String), arg(addr, t.Address)],
}))

export const renewDomain = async(name, duration) => fcl.mutate(txPad({
    cadence: RENEW_DOMAIN,
    args: (arg, t) => [arg(name, t.String), arg(duration, t.UFix64)],
}))

const INIT_ACCOUNT = `
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

transaction() {
    prepare(account: AuthAccount) {
        account.save<@NonFungibleToken.Collection>(<- Domains.createEmptyCollection(), to: Domains.DomainsStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.DomainsPublicPath, target: Domains.DomainsStoragePath)
        account.link<&Domains.Collection>(Domains.DomainsPrivatePath, target: Domains.DomainsStoragePath)
    }
}
`

const REGISTER_DOMAIN = `
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(name: String, duration: UFix64) {
    let nftReceiverCap: Capability<&{NonFungibleToken.Receiver}>
    let vault: @FungibleToken.Vault
    prepare(account: AuthAccount) {
        self.nftReceiverCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.DomainsPublicPath)
        let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
        let rentCost = Domains.getRentCost(name: name, duration: duration)
        self.vault <- vaultRef.withdraw(amount: rentCost)
    }
    execute {
        Domains.registerDomain(name: name, duration: duration, feeTokens: <- self.vault, receiver: self.nftReceiverCap)
    }
}
`

const UPDATE_BIO_FOR_DOMAIN = `
import Domains from 0xDomains

transaction(nameHash: String, bio: String) {
    var domain: &{Domains.DomainPrivate}
    prepare(account: AuthAccount) {
        var domain: &{Domains.DomainPrivate}? = nil
        let collectionPvt = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not load collection private")

        let id = Domains.nameHashToIDs[nameHash]
        if id == nil {
            panic("Could not find domain")
        }

        domain = collectionPvt.borrowDomainPrivate(id: id!)
        self.domain = domain!
    }
    execute {
        self.domain.setBio(bio: bio)
    }
}
`


const UPDATE_ADDRESS_FOR_DOMAIN = `
import Domains from 0xDomains

transaction(nameHash: String, addr: Address) {
    var domain: &{Domains.DomainPrivate}
    prepare(account: AuthAccount) {
        var domain: &{Domains.DomainPrivate}? = nil
        let collectionPvt = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not load collection private")

        let id = Domains.nameHashToIDs[nameHash]
        if id == nil {
            panic("Could not find domain")
        }

        domain = collectionPvt.borrowDomainPrivate(id: id!)
        self.domain = domain!
    }
    execute {
        self.domain.setAddress(addr: addr)
    }
}
`

const RENEW_DOMAIN = `
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(name: String, duration: UFix64) {
  let vault: @FungibleToken.Vault
  var domain: &Domains.NFT
  prepare(account: AuthAccount) {
      let collectionRef = account.borrow<&{Domains.CollectionPublic}>(from: Domains.DomainsStoragePath) ?? panic("Could not borrow collection public")
      var domain: &Domains.NFT? = nil
      let collectionPrivateRef = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not borrow collection private")

      let nameHash = Domains.getDomainNameHash(name: name)
      let domainId = Domains.nameHashToIDs[nameHash]
      log(domainId)
      if domainId == nil {
          panic("You don't own this domain")
      }

      domain = collectionPrivateRef.borrowDomainPrivate(id: domainId!)
      self.domain = domain!
      let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
      let rentCost = Domains.getRentCost(name: name, duration: duration)
      self.vault <- vaultRef.withdraw(amount: rentCost)
  }
  execute {
      Domains.renewDomain(domain: self.domain, duration: duration, feeTokens: <- self.vault)
  }
}
`