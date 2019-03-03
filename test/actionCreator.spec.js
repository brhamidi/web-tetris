import * as actions from '../src/client/actions'
import reducerNextShape from '../src/client/reducers/nextShape'
import reducerInfo from '../src/client/reducers/info'
import reducerStatus from '../src/client/reducers/status'
import reducerScore from '../src/client/reducers/score'

describe('action sync', () => {
	test('update mode', () => {
		const obj = { type: 'solo', meta: { name: undefined } };
		const res = { type: 'SET_MODE', mode: obj };
		expect(actions.updateMode(obj)).toEqual(res);
	});
});
