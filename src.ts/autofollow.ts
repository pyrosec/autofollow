import fs = require("fs-extra");
import { BasePuppeteer } from "base-puppeteer";
import mkdirp from "mkdirp";
import path from "path";
import totpGenerator from "totp-generator";

const timeout = async (n) =>
  await new Promise((resolve) => setTimeout(resolve, n));


export class AutoFollow extends BasePuppeteer {
  public username: string;
  public password: string;
  public cookies: any[];
  async login({ username, password, totpSecret }) {
    await this._page.goto('https://instagram.com');
    await this.waitForSelector({ selector: 'input[name="username"]' });
    await this.type({ selector: 'input[name="username"]', value: username });   
    await this.type({ selector: 'input[name="password"]', value: password });
    await this.click({ selector: 'button[type="submit"]' });
    await this.timeout({ n: 5000 });
    if (await this.evaluate({ script: String(function () { return Boolean(document.querySelector('input[name="verificationCode"]')); }), args: [] })) {
      await this.type({ selector: 'input[name="verificationCode"]', value: totpGenerator(totpSecret.replace(/\s+/g, '')) });
      await this.click({ selector: 'button[type="button"]' });
      await this.timeout({ n: 5000 });
    }
  }
  async followList({ list }) {
    const split = list.toString('utf8').split('\n').filter(Boolean);
    for (const username of split) {
      await this._page.goto('https://instagram.com/' + username);
      await this.waitForSelector({ selector: 'div#fb-root' });
      await this.timeout({ n: 2000 });
      await this._page.evaluate(async () => {
        const b: any = document.querySelector('button[type="button"]');
	if (b) {
          if (b.innerText.match('Follow')) b.click();
	}
	await new Promise((resolve) => setTimeout(resolve, 5000));
      });
      console.log(username);
      await this.timeout({ n: 10000 });
    }
  }
}
