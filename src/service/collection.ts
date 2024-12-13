import apiAxios from "@/service/index";


export function getNftList() {
  return apiAxios.get('/api/getNftList');
}


export function selectNft(id: string) {
  return apiAxios.post('/api/selectNft', {
    id
  });
}

export function verifyNFT(nftId: string, tx: string) {
  return apiAxios.post('/api/verifyNFT', {
    nftId,
    tx
  });
}

