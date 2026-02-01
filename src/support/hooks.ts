import {Before, After, setDefaultTimeout} from '@cucumber/cucumber';
import {CustomWorld} from './world';

Before(async function (this: CustomWorld) {
    await this.init();
    setDefaultTimeout(60000);
});

After(async function (this: CustomWorld) {
    await this.close();
});