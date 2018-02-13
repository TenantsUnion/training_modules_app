import * as config from 'config';
import 'testcafe';

fixture('Account Signup').page(`localhost:${config.get('server.port')}`);

test('Navigate to the account screen and signup with username test_admin', async (t) => {
});
