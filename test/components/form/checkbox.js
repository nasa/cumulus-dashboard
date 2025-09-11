import test from 'ava';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Checkbox from '../../../app/src/js/components/Checkbox/Checkbox';

test('Checkbox renders able to render with correct wrapper label, input label, checked state and show tooltips when tip is provided', (t) => {
    const { container } = render(
        <Checkbox 
            id='chk_test'
            checked={true} 
            label='Test Checkbox Field Label'
            inputLabel='Test Checkbox Input Label'
            className='testCheckbox'
            tip='Test Tooltip'
        />
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