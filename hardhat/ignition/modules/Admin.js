const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AdminModule", (m) => {
    const admin = m.contract("Admin");
    return { admin };
});
