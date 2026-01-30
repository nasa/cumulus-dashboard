import test from 'ava';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Checkbox from '../../../app/src/js/components/Checkbox/Checkbox';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
   getState: () => {},
   locationQueryParams,
   dispatch
  });

test('Checkbox renders able to render with correct wrapper label, input label, checked state and show tooltips when tip is provided', (t) => {
    const { container } = render(
        <Provider store={someStore}>
            <MemoryRouter>
                <Checkbox 
                    id='chk_test'
                    checked={true} 
                    label='Test Checkbox Field Label'
                    inputLabel='Test Checkbox Input Label'
                    className='testCheckbox'
                    tip='Test Tooltip'
                />
            </MemoryRouter>
        </Provider>
    );
    const checkboxWrapper = container.querySelector('.filter-testCheckbox')
    t.truthy(checkboxWrapper)

    const checkbox = screen.getByLabelText('Test Checkbox Input Label');
    t.truthy(checkbox);
    t.true(checkbox.checked)

    fireEvent.mouseOver(checkbox);
    const tooltip = screen.findByText('Test Tooltip');
    t.truthy(tooltip);
});