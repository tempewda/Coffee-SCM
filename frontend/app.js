// app.js

// --- HTML Element References ---
const connectView = document.getElementById('connectView');
const dashboardView = document.getElementById('dashboardView');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const walletAddressSpan = document.getElementById('walletAddress');
const userRole = document.getElementById('userRole');
const farmerInfoSidebar = document.getElementById('farmerInfoSidebar');
const sidebarFarmerName = document.getElementById('sidebarFarmerName');
const sidebarEstateName = document.getElementById('sidebarEstateName');

// Admin UI
const adminSection = document.getElementById('adminSection');
const farmerCountDisplay = document.getElementById('farmerCountDisplay');
const farmerAddressInput = document.getElementById('farmerAddressInput');
const farmerIDInput = document.getElementById('farmerIDInput');
const farmerNameInput = document.getElementById('farmerNameInput');
const estateNameInput = document.getElementById('estateNameInput');
const addFarmerButton = document.getElementById('addFarmerButton');
const adminFeedback = document.getElementById('adminFeedback');

// Farmer UI
const farmerSection = document.getElementById('farmerSection');
const productIDInput = document.getElementById('productIDInput');
const pluckingDateInput = document.getElementById('pluckingDateInput');
const harvestAmtKgInput = document.getElementById('harvestAmtKgInput');
const coffeeTypeInput = document.getElementById('coffeeTypeInput');
const processingMethodInput = document.getElementById('processingMethodInput');
const addProductButton = document.getElementById('addProductButton');
const farmerFeedback = document.getElementById('farmerFeedback');
const productListStatus = document.getElementById('productListStatus');
const productListUl = document.getElementById('productListUl');

// Client UI
const clientSection = document.getElementById('clientSection');
const traceProductIDInput = document.getElementById('traceProductIDInput');
const traceProductButton = document.getElementById('traceProductButton');
const traceResult = document.getElementById('traceResult');
const browseFarmerAddressInput = document.getElementById('browseFarmerAddressInput');
const browseFarmerButton = document.getElementById('browseFarmerButton');
const browseResult = document.getElementById('browseResult');

// Modal UI
const productModal = document.getElementById('productModal');
const modalCloseButton = document.getElementById('modalCloseButton');
const modalSpinner = document.getElementById('modalSpinner');
const modalContent = document.getElementById('modalContent');
const modalProductID = document.getElementById('modalProductID');
const modalPluckingDate = document.getElementById('modalPluckingDate');
const modalHarvestAmount = document.getElementById('modalHarvestAmount');
const modalCoffeeType = document.getElementById('modalCoffeeType');
const modalProcessingMethod = document.getElementById('modalProcessingMethod');

// --- Contract Config & Helpers ---
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "_farmerAddress", "type": "address" }, { "internalType": "uint256", "name": "_farmerID", "type": "uint256" }, { "internalType": "string", "name": "_farmerName", "type": "string" }, { "internalType": "string", "name": "_estateName", "type": "string" } ], "name": "addFarmer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_productID", "type": "uint256" }, { "internalType": "uint256", "name": "_pluckingDate", "type": "uint256" }, { "internalType": "enum stakeholders.CoffeeType", "name": "_coffeeType", "type": "uint8" }, { "internalType": "uint256", "name": "_harvestAmtKg", "type": "uint256" }, { "internalType": "enum stakeholders.ProcessingMethod", "name": "_processingMethod", "type": "uint8" } ], "name": "addProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "admin", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getFarmerCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_farmerAddress", "type": "address" } ], "name": "getFarmerDetails", "outputs": [ { "internalType": "address", "name": "__farmerAddress", "type": "address" }, { "internalType": "uint256", "name": "_farmerID", "type": "uint256" }, { "internalType": "string", "name": "_farmerName", "type": "string" }, { "internalType": "string", "name": "_estateName", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_farmerAddress", "type": "address" } ], "name": "getProductCount", "outputs": [ { "internalType": "uint256", "name": "productCount", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_productID", "type": "uint256" } ], "name": "getProductDetails", "outputs": [ { "internalType": "uint256", "name": "productID", "type": "uint256" }, { "internalType": "uint256", "name": "pluckingDate", "type": "uint256" }, { "internalType": "address", "name": "registeredBy", "type": "address" }, { "internalType": "enum stakeholders.CoffeeType", "name": "coffeeType", "type": "uint8" }, { "internalType": "uint256", "name": "harvestAmtKg", "type": "uint256" }, { "internalType": "enum stakeholders.ProcessingMethod", "name": "processingMethod", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_farmerAddress", "type": "address" } ], "name": "getProductList", "outputs": [ { "internalType": "uint256[]", "name": "productIDList", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_farmerAddress", "type": "address" } ], "name": "isRegisteredFarmer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_productID", "type": "uint256" } ], "name": "isRegisteredProduct", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" } ];
const COFFEE_TYPES = { 0: 'None', 1: 'Robusta', 2: 'Arabica' };
const PROCESSING_METHODS = { 0: 'None', 1: 'Dry', 2: 'Honey', 3: 'Wet' };

let provider, signer, adminContract;

// --- UI / App State Functions ---
function showConnectView() { connectView.classList.remove('hidden'); dashboardView.classList.add('hidden'); }
function showDashboardView(address) { connectView.classList.add('hidden'); dashboardView.classList.remove('hidden'); walletAddressSpan.textContent = address; }
function hideAllRoleSections() { adminSection.classList.add('hidden'); farmerSection.classList.add('hidden'); clientSection.classList.add('hidden'); farmerInfoSidebar.classList.add('hidden'); }

// --- MetaMask Connection ---
async function connectMetaMask() {
    try {
        if (typeof window.ethereum === 'undefined') { alert("Please install MetaMask."); return; }
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        adminContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        showDashboardView(userAddress);
        await handleUserRole(userAddress);
    } catch (error) { console.error("Connection failed:", error); showConnectView(); }
}

function disconnectMetaMask() { showConnectView(); }

async function handleUserRole(userAddress) {
    hideAllRoleSections();
    try {
        const contractAdminAddress = await adminContract.admin();
        if (userAddress.toLowerCase() === contractAdminAddress.toLowerCase()) {
            userRole.textContent = "Admin";
            await renderAdminUI();
        } else if (await adminContract.isRegisteredFarmer(userAddress)) {
            userRole.textContent = "Farmer";
            const details = await adminContract.getFarmerDetails(userAddress);
            sidebarFarmerName.textContent = details._farmerName;
            sidebarEstateName.textContent = details._estateName;
            farmerInfoSidebar.classList.remove('hidden');
            await renderFarmerUI(userAddress);
        } else {
            userRole.textContent = "Guest";
            renderClientUI();
        }
    } catch (error) { console.error("Role determination error:", error); userRole.textContent = "Error"; renderClientUI(); }
}

// --- Admin Functions ---
async function renderAdminUI() {
    adminSection.classList.remove('hidden');
    try {
        farmerCountDisplay.textContent = (await adminContract.getFarmerCount()).toString();
    } catch (error) { farmerCountDisplay.textContent = "Error"; }
}

async function handleAddFarmer() { /* Logic unchanged */ }

// --- Farmer Functions ---
async function renderFarmerUI(farmerAddress) {
    farmerSection.classList.remove('hidden');
    await displayProductList(farmerAddress);
}
async function displayProductList(farmerAddress) { /* Logic unchanged */ }
async function handleAddProduct() { /* Logic unchanged */ }

// --- Client Functions ---
function renderClientUI() {
    clientSection.classList.remove('hidden');
    traceResult.innerHTML = `<p class="text-gray-500">Enter a Product ID to begin.</p>`;
    browseResult.innerHTML = `<p class="text-gray-500">Enter a Farmer Address to begin.</p>`;
}

async function handleTraceProduct() {
    const productID = traceProductIDInput.value;
    if (!productID) {
        traceResult.innerHTML = `<p class="text-red-500">Please enter a Product ID.</p>`;
        return;
    }
    traceResult.innerHTML = `<p class="text-gray-500">Tracing... please wait.</p>`;
    try {
        const details = await adminContract.getProductDetails(productID);
        traceResult.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg border">
                <h4 class="font-bold text-gray-800">Product Found</h4>
                <p><strong>ID:</strong> <span class="font-mono">${details.productID.toString()}</span></p>
                <p><strong>Coffee Type:</strong> <span class="font-mono">${COFFEE_TYPES[details.coffeeType]}</span></p>
                <p><strong>Processing Method:</strong> <span class="font-mono">${PROCESSING_METHODS[details.processingMethod]}</span></p>
                <p><strong>Harvest Amount:</strong> <span class="font-mono">${details.harvestAmtKg.toString()} kg</span></p>
                <p><strong>Plucking Date:</strong> <span class="font-mono">${new Date(details.pluckingDate.toNumber() * 1000).toLocaleDateString()}</span></p>
                <p><strong>Farmer Address:</strong> <span class="font-mono text-xs">${details.registeredBy}</span></p>
            </div>
        `;
    } catch (error) {
        console.error("Trace failed:", error);
        traceResult.innerHTML = `<p class="text-red-500">Error: Product not found or invalid ID.</p>`;
    }
}

async function handleBrowseFarmer() {
    const farmerAddress = browseFarmerAddressInput.value;
    if (!ethers.utils.isAddress(farmerAddress)) {
        browseResult.innerHTML = `<p class="text-red-500">Please enter a valid wallet address.</p>`;
        return;
    }
    browseResult.innerHTML = `<p class="text-gray-500">Searching... please wait.</p>`;
    try {
        const farmerDetails = await adminContract.getFarmerDetails(farmerAddress);
        const productIDs = await adminContract.getProductList(farmerAddress);

        let productListHTML = '<p class="text-gray-500">No products found for this farmer.</p>';
        if (productIDs.length > 0) {
            productListHTML = productIDs.map(id => `<li class="font-mono text-xs hover:bg-gray-100 p-1 rounded-md cursor-pointer" onclick="showProductDetailsModal(${id})">${id.toString()}</li>`).join('');
            productListHTML = `<ul class="list-disc list-inside mt-2">${productListHTML}</ul>`;
        }

        browseResult.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg border">
                <h4 class="font-bold text-gray-800">${farmerDetails._farmerName}</h4>
                <p class="text-xs"><strong>Estate:</strong> ${farmerDetails._estateName}</p>
                <h5 class="font-semibold mt-3">Registered Products:</h5>
                ${productListHTML}
            </div>
        `;
    } catch (error) {
        console.error("Browse failed:", error);
        browseResult.innerHTML = `<p class="text-red-500">Error: Farmer not found or invalid address.</p>`;
    }
}

// --- Modal Functions ---
async function showProductDetailsModal(productID) { /* Logic unchanged */ }
function hideProductDetailsModal() { productModal.classList.add('hidden'); }

// --- Initial Load Logic ---
window.addEventListener('load', () => {
    showConnectView();
    // Event Listeners
    connectButton.addEventListener('click', connectMetaMask);
    disconnectButton.addEventListener('click', disconnectMetaMask);
    addFarmerButton.addEventListener('click', handleAddFarmer);
    addProductButton.addEventListener('click', handleAddProduct);
    modalCloseButton.addEventListener('click', hideProductDetailsModal);
    traceProductButton.addEventListener('click', handleTraceProduct);
    browseFarmerButton.addEventListener('click', handleBrowseFarmer);
});

// Stubs for unchanged functions to keep the file self-contained for display
async function handleAddFarmer() { adminFeedback.textContent = "Processing..."; const farmerAddress = farmerAddressInput.value; const farmerID = parseInt(farmerIDInput.value); const farmerName = farmerNameInput.value; const estateName = estateNameInput.value; if (!ethers.utils.isAddress(farmerAddress) || isNaN(farmerID) || !farmerName || !estateName) { adminFeedback.textContent = "Error: Invalid input."; adminFeedback.className = 'mt-4 text-sm text-center font-medium text-red-500'; return; } try { const tx = await adminContract.addFarmer(farmerAddress, farmerID, farmerName, estateName); await tx.wait(); adminFeedback.textContent = "Farmer added successfully!"; adminFeedback.className = 'mt-4 text-sm text-center font-medium text-green-500'; await renderAdminUI(); } catch (error) { adminFeedback.textContent = `Error: ${error.data ? error.data.message : error.message}`; adminFeedback.className = 'mt-4 text-sm text-center font-medium text-red-500'; } }
async function displayProductList(farmerAddress) { productListStatus.textContent = "Loading products..."; productListUl.innerHTML = ''; try { const productIDs = await adminContract.getProductList(farmerAddress); if (productIDs.length === 0) { productListStatus.textContent = "No products registered yet."; return; } const productDetailsPromises = productIDs.map(id => adminContract.getProductDetails(id)); const allProductDetails = await Promise.all(productDetailsPromises); productListStatus.textContent = ''; allProductDetails.forEach(details => { const li = document.createElement('li'); li.innerHTML = `<span class="font-bold">ID: ${details.productID.toString()}</span> | Type: ${COFFEE_TYPES[details.coffeeType]} | Method: ${PROCESSING_METHODS[details.processingMethod]} <span class="text-blue-600 cursor-pointer hover:underline ml-2">(Details)</span>`; li.className = "text-sm text-gray-800 cursor-pointer hover:bg-gray-100 p-2 rounded-md"; li.onclick = () => showProductDetailsModal(details.productID); productListUl.appendChild(li); }); } catch (error) { productListStatus.textContent = "Failed to load products."; } }
async function handleAddProduct() { farmerFeedback.textContent = "Processing..."; const productID = parseInt(productIDInput.value); const harvestAmt = parseInt(harvestAmtKgInput.value); const pluckingDate = Math.floor(new Date(pluckingDateInput.value).getTime() / 1000); const coffeeType = parseInt(coffeeTypeInput.value); const processingMethod = parseInt(processingMethodInput.value); if (isNaN(productID) || isNaN(harvestAmt) || isNaN(pluckingDate)) { farmerFeedback.textContent = "Error: Invalid input."; farmerFeedback.className = 'mt-4 text-sm text-center font-medium text-red-700'; return; } try { const tx = await adminContract.addProduct(productID, pluckingDate, coffeeType, harvestAmt, processingMethod); await tx.wait(); farmerFeedback.textContent = "Product added successfully!"; farmerFeedback.className = 'mt-4 text-sm text-center font-medium text-green-700'; const userAddress = await signer.getAddress(); await displayProductList(userAddress); } catch (error) { farmerFeedback.textContent = `Error: ${error.data ? error.data.message : error.message}`; farmerFeedback.className = 'mt-4 text-sm text-center font-medium text-red-700'; } }
async function showProductDetailsModal(productID) { productModal.classList.remove('hidden'); modalContent.classList.add('hidden'); modalSpinner.classList.remove('hidden'); try { const details=await adminContract.getProductDetails(productID); modalProductID.textContent=details.productID.toString(); modalPluckingDate.textContent=new Date(details.pluckingDate.toNumber() * 1000).toLocaleDateString(); modalHarvestAmount.textContent=details.harvestAmtKg.toString(); modalCoffeeType.textContent=COFFEE_TYPES[details.coffeeType] || 'Unknown'; modalProcessingMethod.textContent=PROCESSING_METHODS[details.processingMethod] || 'Unknown'; } catch (error) { modalContent.innerHTML="<p class='text-red-500'>Could not load details.</p>"; } finally { modalSpinner.classList.add('hidden'); modalContent.classList.remove('hidden'); } }
