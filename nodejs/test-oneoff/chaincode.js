describe('manual chaincode', ()=>{
    it('instantiate on OBP', () => {
        const CollectionName = 'private'
        const Policy = `OR('founder.member', 'davidkhala-com.member')`
        const PeersRequired = 0;
        const MaxPeerCount = 4;
        const BlockToLive = 0;
    })
})