// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GAZAINToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant FEE_PERCENTAGE = 3; // 3%
    
    address public treasuryAddress;
    mapping(address => bool) private _isExcludedFromFee;

    event ExcludedFromFee(address account, bool isExcluded);
    event TreasuryUpdated(address newTreasury);

    constructor(address initialOwner, address _treasuryAddress) 
        ERC20("Gaza Initiative", "GAZAIN") 
        Ownable(initialOwner) 
    {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;

        // Exclude the initial owner, treasury, and the contract itself from the fee
        _isExcludedFromFee[initialOwner] = true;
        _isExcludedFromFee[_treasuryAddress] = true;
        _isExcludedFromFee[address(this)] = true;

        // Mint the total supply to the initial owner
        _mint(initialOwner, MAX_SUPPLY);
    }

    /**
     * @dev Updates the treasury address.
     */
    function setTreasuryAddress(address _treasuryAddress) external onlyOwner {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
        emit TreasuryUpdated(_treasuryAddress);
    }

    /**
     * @dev Excludes or includes a specific account from being taxed.
     */
    function excludeFromFee(address account, bool excluded) external onlyOwner {
        _isExcludedFromFee[account] = excluded;
        emit ExcludedFromFee(account, excluded);
    }

    /**
     * @dev Checks whether an account is excluded from the fee.
     */
    function isExcludedFromFee(address account) public view returns (bool) {
        return _isExcludedFromFee[account];
    }

    /**
     * @dev Overrides the OpenZeppelin v5 _update function to implement the 3% transfer tax logic.
     * The fee is sent to the treasuryAddress.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // Exclude minting and burning from fee calculations
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        bool takeFee = !_isExcludedFromFee[from] && !_isExcludedFromFee[to];

        if (takeFee) {
            uint256 feeAmount = (value * FEE_PERCENTAGE) / 100;
            uint256 sendAmount = value - feeAmount;

            if (feeAmount > 0) {
                super._update(from, treasuryAddress, feeAmount);
            }
            super._update(from, to, sendAmount);
        } else {
            super._update(from, to, value);
        }
    }
}
