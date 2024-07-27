// CustomModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import styled, { keyframes } from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

// Define keyframes for animation
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components for modal
const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
  position: relative;
  max-width: 500px;
  margin: auto;
  border-radius: 8px;
  animation: ${slideDown} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const CloseButton = styled(AiOutlineClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ddd;
  }

  &.approve {
    background: #4caf50;
    color: white;
  }

  &.reject {
    background: #f44336;
    color: white;
  }

  &.submit {
    background: #2196f3;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
`;

const CustomModal = ({ isOpen, onRequestClose, onApprove, onReject }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    setShowRejectReason(true);
  };

  const handleSubmitRejection = () => {
    onReject(rejectionReason);
    setShowRejectReason(false);
    onRequestClose();
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Approval Modal"
    >
      <CloseButton onClick={onRequestClose} />
      {!showRejectReason ? (
        <>
          <h2>Are you sure?</h2>
          <ButtonGroup>
            <Button className="approve" onClick={onApprove}>Approve</Button>
            <Button className="reject" onClick={handleReject}>Reject</Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <h2>Reason for Rejection</h2>
          <TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <Button className="submit" onClick={handleSubmitRejection}>Submit</Button>
        </>
      )}
    </StyledModal>
  );
};

export default CustomModal;
