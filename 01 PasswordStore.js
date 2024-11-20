const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Password Store",()=>{
    let passwordStore;
    let owner, attacker;

    beforeEach(async ()=>{
        [owner,attacker] = await ethers.getSigners();
        const PasswordStore = await ethers.getContractFactory("PasswordStore");
        passwordStore = await PasswordStore.deploy();
    });

    describe("Reading password",()=>{
        it("Owner can read the password",async ()=>{
            let ownerPassword = "password";
            await passwordStore.connect(owner).setPassword(ownerPassword);
            expect(await passwordStore.connect(owner).getPassword()).to.equal(ownerPassword);
        });
        it("Attacker or Other account cannot read the password",async()=>{
            let ownerPassword = "password";
            await passwordStore.connect(owner).setPassword(ownerPassword);
            await expect(passwordStore.connect(attacker).getPassword()).to.be.reverted;
        });
    });

    describe("Setting password",()=>{
        it("Owner can set the password",async()=>{
            let ownerPassword = "password";
            await passwordStore.connect(owner).setPassword(ownerPassword);
            expect(await passwordStore.connect(owner).getPassword()).to.equal(ownerPassword);
        });
        it("Attacker or Other account can set the password, and only owner can be read by owner",async()=>{
            let hackerPassword = "hacker";
            await passwordStore.connect(attacker).setPassword(hackerPassword);
            expect(await passwordStore.connect(owner).getPassword()).to.equal(hackerPassword);
        });
    });
})