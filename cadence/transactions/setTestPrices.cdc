import Domains from 0x448a344b9bed0110

transaction() {
    let registrar: &Domains.Registrar

    prepare(account: AuthAccount){
        self.registrar = account.borrow<&Domains.Registrar>(from: Domains.RegistrarStoragePath)
            ?? panic("could not borrow registrar")
    }

    execute {
        var len = 1
        while len < 5 {
            self.registrar.setPrices(key: len, val: 0.000002)
            len = len + 1
        }
        while len < 11 {
            self.registrar.setPrices(key: len, val: 0.0000001 * UFix64(20 - len))
            len = len + 1
        }
    }
}