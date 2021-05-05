const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

const INITIAL_MESSAGE = "Hello World";
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  senderAddress = accounts[0];

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send({ from: senderAddress, gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contractss", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, INITIAL_MESSAGE);
  });

  it("can change the contract message", async () => {
    const newMessage = "Goodbye World";

    await inbox.methods.setMessage(newMessage).send({ from: senderAddress });
    const contractMessage = await inbox.methods.message().call();

    assert.strictEqual(contractMessage, newMessage);
  });
});
