// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library stakeholders {
    struct Farmer {

        address farmerAddress;  // account of the registered farmer
        uint farmerID;          // assign some kind of ID to farmers
        string farmerName;      // name of the farmer
        string estateName;      // name of the estate the farmer works in
    }


    /* type of coffee provided by the farmer
     * since its enum, value can be assigned via uints 0, 1, and 2
     * 0 - None
     * 1 - Robusta
     * 2 - Arabica
     */
    enum CoffeeType {
        None,
        Robusta,
        Arabica
    }


    /* processing method used by the farmer
     * since its enum, value can be assigned via uints 0, 1, 2 and 3
     * 0 - None
     * 1 - Dry
     * 2 - Honey
     * 3 - Wet
     */
    enum ProcessingMethod {
        None,
        Dry,
        Honey,
        Wet
    }


    struct Product {
        uint productID;                     // some kind of id given to the batch
        uint pluckingDate;                  // oct to march, dec jan max yield, remaining till march
        address registeredBy;               // address of the farmer registering the product
        CoffeeType coffeeType;              // type of coffee - either Robusta or Arabica, enforced with the help of enums
        // work required...
        uint harvestAmtKg;                  // weight of the batch, may be in decimals, extra work required here...
        // work required...
        ProcessingMethod processingMethod;  // processing method - dry or honey or wet processing, enforced with the help of enums
    }

    /*
    farm to estate to curing works -
    curing works to middleman/supplier -

    processing - dry and wet - ferment bean
    12 percent
    honey process - outer dry with musilage - no fermentation

    curing works - different unit - parch - dehuling process - parchmen layer / silven skin removed
    packed acco to sizes - aaa highest, aa, ab, b
    */
}

contract Admin {
    /* store the count of registered farmers
     * set to private - can only be accessed through getter and setter methods
     */
    uint private farmerCount = 0;


    /* stores the registered product ids as an uint array, corresponding to farmer addresses
     * set to private - can only be accessed through getter and setter methods
     */
    mapping(address => uint[]) private farmerProductIDList;


    // stores a list of registered product ids, and the corresponding product details 
    mapping(uint => stakeholders.Product) private productList;
    

    // stores a list of registered farmer addresses, and the corresponding farmer details 
    mapping(address => stakeholders.Farmer) private farmerList;


    // stores the address of the admin
    address public admin;


    // the one deploying the contract becomes the owner
    constructor() {
        admin = msg.sender;
    }


    // validates that only the admin can call the function
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the System Admin is authorised for this action");
        _;
    }


    // validates that only the registered farmers can call the function
    modifier onlyFarmer () {
        require(isRegisteredFarmer(msg.sender), "Only the registered farmers are authorised for this action");
        _;
    }


    /* view the number of registered farmers
     * visibility set to public, anyone can call this function
     */
    function getFarmerCount() public view returns (uint) {
        return farmerCount;
    }


    /* update the registered farmers' count by 1
     * can only be called by the admin
     */
    function updateFarmerCount() onlyAdmin private {
        farmerCount += 1;
    }


    /* check if a farmer address belongs to our list of registered farmers
     * visibility set to public, accessible to everyone
     */
    function isRegisteredFarmer(address _farmerAddress) public view returns (bool) {
        /* farmerList maps from an address to stakeholders.Farmer struct
         * due to nature of maps data structure, every possible address is by default mapped to a struct with default initial values 
         * if address isn't present in our mapping, that is the particular addresshasn't been input by the admin to our list of registered farmers,
         * then that address will map to a default value struct, where address equals address(0)
         * hence, a check for address(0) gives a O(1) (time constant) check for the presence of a particular address in our map
         */
        return (farmerList[_farmerAddress].farmerAddress != address(0));

    }


    /* get farmer details from an address
     * revert if farmer not present in list of registered farmers
     * visibility set to public, can be accessible by everyone
     */
    function getFarmerDetails (address _farmerAddress) public view returns (address __farmerAddress, uint _farmerID, string memory _farmerName, string memory _estateName) {
        require(isRegisteredFarmer(_farmerAddress), "Farmer not registered! Reverting...");
        __farmerAddress = _farmerAddress;
        _farmerID = farmerList[_farmerAddress].farmerID;
        _farmerName = farmerList[_farmerAddress].farmerName;
        _estateName = farmerList[_farmerAddress].estateName;
    }


    /* add a new farmer to our list of registered farmers
     * can only be called by the admin
     */
    function addFarmer(address _farmerAddress,
                       uint _farmerID,
                       string calldata _farmerName,
                       string calldata _estateName
                        ) public onlyAdmin{
        require(!isRegisteredFarmer(_farmerAddress), "Farmer already registered! Reverting...");
        farmerList[_farmerAddress] = stakeholders.Farmer(
                                        _farmerAddress,
                                        _farmerID,
                                        _farmerName,
                                        _estateName
                                        );
        updateFarmerCount();
    }


    /* view the number of products registered by a farmer
     * checks whether the farmer address exists in our list of existing farmers
     * visibility set to public, anyone can call this function
     */
    function getProductCount(address _farmerAddress) public view returns (uint productCount) {
        require(isRegisteredFarmer(_farmerAddress), "Farmer not registered! Reverting...");
        uint[] memory productIDList = farmerProductIDList[_farmerAddress];
        productCount = productIDList.length;
    }


    /* view the list of product ids registered by a farmer
     * checks whether the farmer address exists in our list of existing farmers
     * visibility set to public, anyone can call this function
     */
    function getProductList(address _farmerAddress) public view returns (uint[] memory productIDList) {
        require(isRegisteredFarmer(_farmerAddress), "Farmer not registered! Reverting...");
        productIDList = farmerProductIDList[_farmerAddress];
    }



    /* check if a product id belongs to our list of registered products
     * visibility set to public, accessible to everyone
     */
    function isRegisteredProduct(uint _productID) public view returns (bool) {
        /* productList maps from a uint to stakeholders.Product struct
         * due to nature of maps data structure, every possible productID(uint) is by default mapped to a struct with default initial values 
         * if productID isn't present in our mapping, that is the particular productID hasn't been input by the farmer to our list of registered products,
         * then that productID will map to a default value struct, where productID equals 0 (default value of uint in Solidity)
         * hence, a check for productID gives a O(1) (time constant) check for the presence of a particular productID in our map
         */
        return (productList[_productID].productID != 0);

    }


    /* get product details from a productID
     * revert if product not present in list of registered products
     * visibility set to public, can be accessible by everyone
     */
    function getProductDetails (uint _productID) public view returns (uint productID, uint pluckingDate, address registeredBy, stakeholders.CoffeeType coffeeType, uint harvestAmtKg, stakeholders.ProcessingMethod processingMethod) {
        require(isRegisteredProduct(_productID), "Product not registered! Reverting...");
        productID = _productID;
        pluckingDate = productList[productID].pluckingDate;
        registeredBy = productList[productID].registeredBy;
        coffeeType = productList[productID].coffeeType;
        harvestAmtKg = productList[productID].harvestAmtKg;
        processingMethod = productList[productID].processingMethod;
    }


    /* add new product, can only be called by registered farmers
     * revert if farmer not present in list of registered farmers
     * also revert, if product already registered
     */
    function addProduct(uint _productID,
                        uint _pluckingDate,
                        stakeholders.CoffeeType _coffeeType,
                        uint _harvestAmtKg,
                        stakeholders.ProcessingMethod _processingMethod
                        ) public onlyFarmer {
        require(!isRegisteredProduct(_productID), "Product already registered! Reverting...");
        address farmerAddress = msg.sender;
        farmerProductIDList[farmerAddress].push(_productID);
        productList[_productID] = stakeholders.Product(
                                    _productID,
                                    _pluckingDate,
                                    farmerAddress,
                                    _coffeeType,
                                    _harvestAmtKg,
                                    _processingMethod        
                                    );
    }
}
