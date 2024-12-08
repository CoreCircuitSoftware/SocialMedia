// src/components/FriendActions.jsx
import React from 'react';

function FriendActions({ profile, myProfile, friendStatus, handleAddFriend, handleAcceptFriendRequestByButton, handleRemoveFriend }) {
  return (
    <div>
      {friendStatus === 'none' && (
        <button className="edit-button" onClick={handleAddFriend}>Add Friend</button>
      )}
      {friendStatus === 'pending' && (
        <p>Friend Request Sent</p>
      )}
      {friendStatus === 'pending_received' && (
        <div>
          <button onClick={() => handleAcceptFriendRequestByButton(true)}>Accept Friend Request</button>
          <button onClick={() => handleAcceptFriendRequestByButton(false)}>Decline</button>
        </div>
      )}
      {friendStatus === 'friends' && (
        <button className="logout-button" onClick={handleRemoveFriend}>Remove Friend</button>
      )}
    </div>
  );
}

export default FriendActions;
