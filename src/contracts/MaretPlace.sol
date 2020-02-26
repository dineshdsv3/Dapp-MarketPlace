pragma solidity ^0.5.0;

contract MarketPlace {
    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public {
        require(bytes(_name).length > 0,"Invalid name");
        require(_price > 0,"Invalid Price");
        productCount++;
        products[productCount] = Product(productCount,_name,_price,msg.sender,false);
        emit ProductCreated(productCount,_name,_price,msg.sender,false);
    }

    function purchaseProduct(uint _id) public payable {
        // Get the product from the products list and create a new copy in the memory
        Product memory _product = products[_id];

        // Fetch the owner of the particular product
        address payable _seller = _product.owner;

      require(_product.id > 0 && _product.id <= productCount,"Product ID");

        // Make sure that the buyer has enough money to make this transaction
        require(msg.value >= _product.price,"Value of product");

        // Make sure that product is not purchased yet
        require(!_product.purchased,"Product already purchased");

        // Make sure that buyer is not the seller
        require(_seller != msg.sender,"Buyer cant be seller");

        // transfer ownership to the buyer
        _product.owner = msg.sender;

        // mark the product as purchased
        _product.purchased = true;

        // update the product
        products[_id] = _product;

        // pay the seller by sending them Ether
        address(_seller).transfer(msg.value);

        // trigger an event
        emit ProductCreated(productCount,_product.name,_product.price,msg.sender,true);

    }
}
