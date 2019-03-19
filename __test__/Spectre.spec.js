import React from 'react';
import { shallow } from 'enzyme';
import Spectre from '../src/client/components/spectre';

import { List } from 'immutable';

describe('Spectre', () => {
	test('renders correctly in multi', () => {
		const spectreProps = List().set(9, 2).map(e => 0);
		const modeProps = { type: 'multi', meta: { name: "Deneryss" } };
		const wrapper = shallow(<Spectre mode={modeProps} spectre={spectreProps} />);

		expect(wrapper).toMatchSnapshot();
	});
	test('renders correctly in solo', () => {
		const spectreProps = List().set(9, 2).map(e => 0);
		const modeProps = { type: 'solo', meta: { name: undefined } };
		const wrapper = shallow(<Spectre mode={modeProps} spectre={spectreProps} />);

		expect(wrapper).toMatchSnapshot();
	});
});
