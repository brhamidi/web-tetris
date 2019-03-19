import React from 'react';
import { shallow } from 'enzyme';
import Score from '../src/client/components/score';

import AppContainer from '../src/client/containers/AppContainer';
import SpectreContainer from '../src/client/containers/SpectreContainer';
import BoardContainer from '../src/client/containers/BoardContainer';
import NextShapeContainer from '../src/client/containers/NextShapeContainer';
import ScoreContainer from '../src/client/containers/ScoreContainer';

describe('Score', () => {
	test('renders correctly', () => {
		const wrapper = shallow(<Score />);
		expect(wrapper).toMatchSnapshot();
	});
});
