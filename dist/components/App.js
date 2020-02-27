import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Marketplace from "../abis/MarketPlace.json";
import Navbar from "./Navbar";
import Main from "./Main";
// import ipfs from "../ipfs";

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host:'ipfs.infura.io', port: 5001, protocol: 'https' });

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      console.log(marketplace);
      this.setState({ marketplace });
      const productCount = await marketplace.methods.productCount().call();
      this.setState({ productCount });
      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        });
      }
      // console.log(this.state.products)
      // console.log(productCount.toString())
      this.setState({ loading: false });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
      buffer: null
    };
    // Binding
    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  }

  captureFile = e => {
    e.preventDefault();
    console.log("image Captured");
    const file = e.target.files[0];
    // console.log(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      // console.log("Buffer is", this.state.buffer);
    };
  };

  submitHandle = e => {
    e.preventDefault();
    console.log(this.state.buffer);
    // console.log("Submit clicked");
    ipfs.add(this.state.buffer, (err, result) => {
      console.log(`ipfs result is ${result}`)
      if(err){
        console.log(err)
      }
    });
  };

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {this.state.loading
                  ? 'Loading'
                  : <Main 
                  products = {this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct} 
                  />
                }
                <form onSubmit={this.submitHandle}>
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
