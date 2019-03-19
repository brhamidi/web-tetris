import React from 'react';
import { shallow } from 'enzyme';
import Score from '../src/client/components/score';

describe('Score', () => {
	test('renders correctly', () => {
		const wrapper = shallow(<Score />);
		expect(wrapper).toMatchSnapshot();
	});
});
