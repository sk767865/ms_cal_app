import React from 'react';
import imageUrl from '../assets/nagarro.png';

const NagarroHeader = () => {
    return (
        <header style={headerStyle}>
            <img src={imageUrl} alt="Nagarro Logo" style={imageStyle} />
            <h1 style={titleStyle}>
                <b>
                    nagarro
                </b>
            </h1>
        </header>
    );
}

const headerStyle = {
    background: '#06041f',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '10px'
}

const imageStyle = {
    maxWidth: '40px',
    marginRight: '10px'
}

const titleStyle = {
    margin: '0',
    fontSize: '1.54em'



}

export default NagarroHeader;
