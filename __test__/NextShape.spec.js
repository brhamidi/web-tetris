import React from 'react';
import { shallow } from 'enzyme';
import NextShape from '../src/client/components/nextShape';

import { List } from 'immutable'

describe('NextShape', () => {
	test('renders correctly', () => {
		const shape = List().set(6, undefined).map(e => List().set(4, undefined));
		const wrapper = shallow(<NextShape shape={shape} />);

		expect(wrapper).toMatchSnapshot();
	});
});
