import React from 'react';
import EoiPortal from './portal/EOIPortal';

export default function ApplicationModal({ isOpen, onClose }) {
  return (
    <EoiPortal
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
