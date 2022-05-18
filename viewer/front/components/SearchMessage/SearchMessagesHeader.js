import React from 'react';
const SearchMessagesHeader = ({ searchWord }) => {
    return (
        < div className="messages-header" >
            <div className="title">Search: {searchWord}</div>
        </div >
    );
};

export default SearchMessagesHeader;

