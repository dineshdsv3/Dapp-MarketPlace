pragma solidity ^0.5.0;

contract MarketPlace {
    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        require(bytes(_name).length > 0,"Invalid name");
        require(_price > 0,"Invalid Price");
        productCount++;
        products[productCount] = Product(productCount,_name,_price,msg.sender,false);
        emit ProductCreated(productCount,_name,_price,msg.sender,false);
    }
    
}
