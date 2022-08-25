import * as fcl from '@onflow/fcl'

export const checkIsInit = async (addr) => fcl.query({
    cadence: IS_INIT,
    args: (arg, t) => [arg(addr, t.Address)],
})

export const getAllDomainInfos = async () => fcl.query({
    cadence: GET_ALL_DOMAIN_INFOS,
})

export const getRentCost = async(name, duration) => fcl.query({
    cadence: GET_RENT_COST,
    args: (arg, type) => [arg(name, type.String), arg(duration, type.UFix64)],
})

export const checkIsAvailable = async(name) => fcl.query({
    cadence: CHECK_IS_AVAILABLE,
    args: (arg, type) => [arg(name, type.String)],
})

export const getDomainInfoByNameHash = async(addr, nameHash) => fcl.query({
    cadence: GET_DOMAIN_BY_NAMEHASH,
    args: (arg, type) => [arg(addr, type.Address), arg(nameHash, type.String)],
})

const IS_INIT = `
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

pub fun main(account: Address): Bool{
    let capability = getAccount(account).getCapability<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.DomainsPublicPath)
    return capability.check()
}
`

const GET_ALL_DOMAIN_INFOS = `
import Domains from 0xDomains

pub fun main(): [Domains.DomainInfo] {
    let allOwners = Domains.getAllOwners()
    let infos: [Domains.DomainInfo] = []

    for nameHash in allOwners.keys {
        let publicCap = getAccount(allOwners[nameHash]!).getCapability<&Domains.Collection{Domains.CollectionPublic}>(Domains.DomainsPublicPath)
        let collection = publicCap.borrow()!
        let id = Domains.nameHashToIDs[nameHash]
        if id != nil {
            let domain = collection.borrowDomain(id: id!)
            let domainInfo = domain.getInfo()
            infos.append(domainInfo)
        }
    }
    return infos
}
`

const CHECK_IS_AVAILABLE = `
import Domains from 0xDomains

pub fun main(name: String): Bool {
    return Domains.isAvailable(nameHash: name)
}
`

const GET_RENT_COST = `
import Domains from 0xDomains

pub fun main(name: String, duration: UFix64): UFix64 {
    return Domains.getRentCost(name: name, duration: duration)
}
`

const GET_DOMAIN_BY_NAMEHASH = `
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

pub fun main(account: Address, nameHash: String): Domains.DomainInfo {
  let capability = getAccount(account).getCapability<&Domains.Collection{NonFungibleToken.CollectionPublic, Domains.CollectionPublic}>(Domains.DomainsPublicPath)
  let collection = capability.borrow() ?? panic("Collection capability could not be borrowed")

  let id = Domains.nameHashToIDs[nameHash]
  if id == nil {
    panic("Domain not found")
  }

  let domain = collection.borrowDomain(id: id!)
  let domainInfo = domain.getInfo()
  return domainInfo
}
`