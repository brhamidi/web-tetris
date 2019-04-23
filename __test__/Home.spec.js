import React from 'react';
import { shallow, mount} from 'enzyme';
import Home from '../src/client/components/Home';
import { List } from 'immutable';

describe('Home', () => {
	test('renders correctly', () => {
		const cb = jest.fn((a, b) => {});
		const onStart = jest.fn((a, b) => {});
		const wrapper = shallow(<Home OnStart={onStart} cb={cb} status={'ERROR'} gameList={List()} />);
		expect(wrapper).toMatchSnapshot();
	});
	test('Simulate wrong input value', () => {
		const cb = jest.fn((a, b) => {});
		const onStart = jest.fn((a, b) => {});
		const wrapper = mount(<Home OnStart={onStart} cb={cb} status={'ERROR'} gameList={List()} />);

		expect(cb.mock.calls.length).toBe(0);

		wrapper.find('form').simulate('submit');

		expect(cb.mock.calls.length).toBe(0);

		wrapper.find('input.room').simulate('change', {target:{value:"GOT"}});
		wrapper.find('input.player').simulate('change', {target:{value:"PDF"}});

		wrapper.find('form').simulate('submit');

		expect(cb.mock.calls.length).toBe(1);
	})
});
