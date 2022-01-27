// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;


/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721Standard {
    function mint(address _to, string memory _uri) external;
    function batchMint(address[] memory _to, string[] memory _uri) external;
    function getBalance(address to) external view returns(uint256);
    function getTokenId(address to, uint256 index) external view returns(uint256);    
}