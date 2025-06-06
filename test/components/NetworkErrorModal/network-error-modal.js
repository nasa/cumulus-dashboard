import test from 'ava';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import NetworkErrorModal from '../../../app/src/js/components/NetworkErrorModal/network-error-modal';

const setNavigatorOnline = (isOnline) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    get: () => ononline,
  });
};

test('NetworkErrorModal shows when offline', async (t) => {
  setNavigatorOnline(false);
  render(<NetworkErrorModal />);

  const modalText = screen.getByText(/Your network appears to be offline/);
  t.truthy(modalText);

  const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
  t.truthy(dismissButton);

  // Check that the modal is visible
  const modal = screen.getByRole('dialog');
  t.truthy(modal);
}
);