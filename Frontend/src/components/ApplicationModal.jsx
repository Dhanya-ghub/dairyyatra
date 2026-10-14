import React from 'react';
import EoiPortal from './portal/EoiPortal';

export default function ApplicationModal({ isOpen, onClose }) {
  return (
    <EoiPortal
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
