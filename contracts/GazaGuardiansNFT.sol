// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GazaGuardiansNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1948;
    uint256 public constant MINT_PRICE = 0.05 ether;
    // User must hold > 50,000 $GAZAIN to mint
    uint256 public constant REQUIRED_GAZAIN_BALANCE = 50_000 * 10**18;

    uint256 private _nextTokenId;
    
    IERC20 public immutable gazaToken;
    address public treasuryAddress;

    error MaxSupplyReached();
    error IncorrectPayment();
    error NotWhitelisted();
    error TransferFailed();

    event TreasuryUpdated(address newTreasury);

    constructor(
        address initialOwner, 
        address _gazaToken, 
        address _treasuryAddress
    ) 
        ERC721("Gaza Guardians", "GUARD") 
        Ownable(initialOwner) 
    {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        gazaToken = IERC20(_gazaToken);
        treasuryAddress = _treasuryAddress;
        _nextTokenId = 1; // Start token ID at 1
    }

    /**
     * @dev Mints an NFT to the caller. Requires sending 0.05 ETH (or MATIC/POL)
     * and holding > 50,000 $GAZAIN tokens as whitelist check.
     */
    function mint(string memory uri) external payable nonReentrant {
        if (_nextTokenId > MAX_SUPPLY) revert MaxSupplyReached();
        if (msg.value != MINT_PRICE) revert IncorrectPayment();
        
        // Whitelist logic: verify caller holds the required $GAZAIN amount
        if (gazaToken.balanceOf(msg.sender) <= REQUIRED_GAZAIN_BALANCE) {
            revert NotWhitelisted();
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Updates the treasury address capable of receiving withdrawn funds.
     */
    function setTreasuryAddress(address _treasuryAddress) external onlyOwner {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
        emit TreasuryUpdated(_treasuryAddress);
    }

    /**
     * @dev Withdraws collected funds directly to the treasury address.
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(treasuryAddress).call{value: balance}("");
        if (!success) revert TransferFailed();
    }

    // ------------------------------------------------------------------------
    // Overrides required by Solidity for ERC721URIStorage inheritance
    // ------------------------------------------------------------------------

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
