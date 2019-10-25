import React from 'react';

class TopButton extends React.Component{
    constructor(props){
        super(props);
    }

    topPage() {
        window.scrollTo(0,0);
    }
  
    render () {
        return (
            <div className='top'>
                <button className='button--top' onClick={this.topPage}> Go To Top of Page
                </button>
            </div>
        );
    }

}

export default TopButton;
