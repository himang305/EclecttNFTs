const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const NFT = {
  address: "0xdb823FaF3388E034382A3Fdc153EE7f3d089ACd4",
  abi: [
    "function safeMint(address to, string memory uri, uint price) external",
    "function buyNFT(uint _tokenId) public payable",
    "function getHashMessage(string calldata,uint) public pure returns(bytes32)",
    "function buyNFTwLazyMint(string calldata uri, uint price, bytes memory signature) public payable",
    "function listNFT(uint, uint) external" 
  ]
};

async function mintNFT() {
  /*=======
    CONNECT TO METAMASK
    =======*/
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();
  document.getElementById("userAddress").innerText =
  userAddress.slice(0, 8) + "...";

  /*======
    INITIALIZING CONTRACT
    ======*/
  const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);

  var nftPrice = ethers.utils.parseEther("0.0001");
  var nftTokenURI = "nft_image_link";
  var nftOwnerAddress = "0xf922e3223567AeB66e6986cb09068B1B879B6ccc";

  const tx = await nftContract.safeMint(nftOwnerAddress, nftTokenURI, nftPrice);
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  var nftId = BigInt(receipt.events[0].topics[1]).toString();
  console.log("NFT ID minted = ",nftId);

}

async function buyNFT() {
  /*=======
    CONNECT TO METAMASK
    =======*/
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();
  document.getElementById("userAddress").innerText =
  userAddress.slice(0, 8) + "...";

  /*======
    INITIALIZING CONTRACT
    ======*/
  const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);

  var nftPrice = ethers.utils.parseEther("0.0001");
  var nftID = 0;

  const tx = await nftContract.buyNFT(nftID,{value:nftPrice});
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log(receipt.status);

}

async function buyNFTwLazyMint() {
  /*=======
    CONNECT TO METAMASK
    =======*/
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();
  document.getElementById("userAddress").innerText =
  userAddress.slice(0, 8) + "...";

  /*======
    INITIALIZING CONTRACT
    ======*/
  const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);

  var nftPrice = ethers.utils.parseEther("0.0001");
  var nftURI = "Image_Link_details_lazy_test";
  var sign = await signMessage();
  const tx = await nftContract.buyNFTwLazyMint(nftURI,nftPrice,sign,{value:nftPrice});

  const receipt = await tx.wait();
  console.log("receipt = ",receipt);

  var nftId = BigInt(receipt.events[1].topics[1]).toString();
  console.log("NFT ID minted = ",nftId);

}

const signMessage = async () => {

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();

  const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);
  
  var nftPrice = ethers.utils.parseEther("0.0001");
  var nftURI = "Image_Link_details_lazy_test";

  const message = await nftContract.getHashMessage(nftURI,nftPrice);

      const signature = await signer.signMessage(ethers.utils.arrayify(message));
      console.log("Message : ",message);
      console.log("Signature : ",signature);
      return signature;
  
}


async function listNFT() {
  /*=======
    CONNECT TO METAMASK
    =======*/
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();
  document.getElementById("userAddress").innerText =
  userAddress.slice(0, 8) + "...";

  /*======
    INITIALIZING CONTRACT
    ======*/
  const nftContract = new ethers.Contract(NFT.address, NFT.abi, signer);

  var nftPrice = ethers.utils.parseEther("0.0001");
  var nftId = 0;

  const tx = await nftContract.listNFT(nftId, nftPrice);
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  console.log("Status = ",receipt.status);

}
