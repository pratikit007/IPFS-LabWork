import React, { Component } from "react";
import "./App.css";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("https://ipfs.infura.io:5001");

class App extends Component {
  state = {
    storageValue: "QmQqKLDvGQjPpiD9y4njLzAVYgwF1DDV3ZWpHKnc1RmHk9",
    buffer: null,
    loading: "",
  };

  captureFile = (event) => {
    event.preventDefault();

    console.log(event.target.files[0]);
    const file = event.target.files[0];
    console.log(file);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("Buffer", this.state.buffer);
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: "Image upload is in progress....." });
    
    var hash = "";
    for await (const result of await ipfs.add(this.state.buffer)) {
      console.log(result);
      hash = result.path;
    }
    console.log("IPFS Hash: ", hash);
    this.setState({ storageValue: hash, loading: "" });
  };
  render() {
    return (
      <div className="Container">
          <h1>IPFS File Upload</h1>
        </nav>
        <main>
          {this.state.storageValue !== "" ? (
            <img
              src={`https://ipfs.io/ipfs/${this.state.storageValue}`}
              alt="Image not available"
            />
          ) : (
            <i>There is no image</i>
          )}
          <p>{this.state.loading === "" ? "" : this.state.loading}</p>

          <div>
            <div">
              <form onSubmit={this.onSubmit} className="form-inline mTop">
                <input
                  type="file"
                  onChange={this.captureFile}
                />
                <input
                  type="submit"
                />
              </form>
              <p>
                TImage hash:{" "}
                {this.state.storageValue === "" ? (
                  <i>Please Upload the image </i>
                ) : (
                  this.state.storageValue
                )}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;