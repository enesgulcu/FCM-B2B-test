"use client";
import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const CargoTrackingButton = ({ company, trackingNumber }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber).then(
      () => {
        toast.success("Kargo takip no kopyalandı!");
      },
      (err) => {
        toast.error("Kopyalanamadı!");
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <StyledWrapper $company={company} $trackingNumber={trackingNumber}>
      <button className="button" onClick={handleCopy} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    position: relative;
    background-color: transparent;
    color: #e8e8e8;
    font-size: 14px; // Adjusted for better fit
    font-weight: 600;
    border-radius: 10px;
    width: 150px;
    height: 40px; // Adjusted height
    border: none;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    margin-top: 8px; // Added margin for spacing
  }

  .button::before {
    content: "${(props) => props.$company}";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: #295f98; // Project-consistent color
    color: white;
    transform: translate(0%, 0%); // Start with company name visible
    z-index: 1;
    position: relative;
    transform-origin: bottom;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .button::after {
    content: "${(props) => props.$trackingNumber}";
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3c87c8; // Lighter blue for hover
    color: white;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform-origin: top;
    transform: translate(0%, -100%);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    // Text overflow handling
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
  }

  .button:hover::before {
    transform: translate(0%, 100%);
  }

  .button:hover::after {
    transform: translate(0%, -100%);
  }

  .button:focus {
    outline: none;
  }

  .button:active {
    scale: 0.95;
  }
`;

export default CargoTrackingButton;
