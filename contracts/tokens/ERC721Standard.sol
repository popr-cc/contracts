// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IERC721Standard.sol";

contract ERC721Standard is
    AccessControl,
    ERC721Enumerable,
    IERC721Standard
{
    uint256 public currentTokenId;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => string) public uri;

    uint256 public constant UNIT = 1e18;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    // ========== ADMIN FUNCTIONS ==========

    function mint(address _to, string memory _uri) external virtual override {        
        require(hasRole(MINTER_ROLE, _msgSender()), "Only minter");
        _safeMint(_to, _uri);        
    }

    function batchMint(address[] memory _to, string[] memory _uri) external virtual override {
        require(hasRole(MINTER_ROLE, _msgSender()), "Only minter");
        require(_to.length == _uri.length, "Invalid params");
        for (uint256 i = 0; i < _to.length; i++) {
            _safeMint(_to[i], _uri[i]);
        }
    }

    // ========== VIEW FUNCTIONS ==========

    function getBalance(address to) external virtual override view returns (uint256) {
        return balanceOf(to);
    }

    function getTokenId(address to, uint256 index) external virtual override view returns (uint256) {
        return tokenOfOwnerByIndex(to, index);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return uri[_tokenId];
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    // ========== INTERNAL FUNCTIONS ==========

    function _safeMint(address _to, string memory _uri) internal {
        require(bytes(_uri).length > 0, "Invalid URI");

        super._safeMint(_to, currentTokenId);

        uri[currentTokenId] = _uri;
        currentTokenId++;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
