import Domains from "../contracts/Domains.cdc"
import NonFungibleToken from "../contracts/interfaces/NonFungibleToken.cdc"

pub fun main(account: Address): Bool{
    let capability = getAccount(account).getCapability<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.DomainsPublicPath)
    return capability.check()
}