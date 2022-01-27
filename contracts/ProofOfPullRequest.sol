//SPDX-License-Identifier: MIT-0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IERC721Standard.sol";
import "./lib/console.sol";

contract ProofOfPullRequest is Initializable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    event Minted(address indexed to, uint256 indexed tokenId);

    address private token;

    function initialize(address _token) public initializer {
        token = _token;
    }

    function mint(string memory _uri) public {
        IERC721Standard(token).mint(msg.sender, _uri);
        uint256 lastIndex = IERC721Standard(token).getBalance(msg.sender);
        uint256 tokenId = IERC721Standard(token).getTokenId(
            msg.sender,
            lastIndex - 1
        );
        emit Minted(msg.sender, tokenId);
    }
}
