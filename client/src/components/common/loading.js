import React, { Component } from 'react';
import '../../assets/css/loading.css'

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {
        return (<div className='loading-main'>
            <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
            </div> </div>
            // <div className='loading-main'>
            //     <div className="lds-roller">
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //     </div>
            // </div>
        )

    }

}

export default Loading;