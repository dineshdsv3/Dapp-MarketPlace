import React, { Component } from 'react';

class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

                <h5 className="text-green">
                    
                    <small className="text-white"><span id="account">Account associated is {this.props.account}</span></small>
                </h5>

            </nav>
        );
    }
}
export default Navbar;