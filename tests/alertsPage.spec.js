import { test as base, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { AlertsPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

const faker = Fakerator('lt-LT');

// ----------------------------
// Custom fixture for AlertsPage
// ----------------------------
const test = base.extend({
  alertsPage: async ({ page }, use) => {
    await test.step('Block ads and navigate to Alerts page', async () => {
      await AdBlocker.blockAds(page);
      const alertsPage = new AlertsPage(page);
      await alertsPage.navigateTo('https://demoqa.com/alerts');

      // Wait until all alert buttons are visible
      await alertsPage.alertBtn.waitFor({ state: 'visible' });
      await alertsPage.timerAlertBtn.waitFor({ state: 'visible' });
      await alertsPage.confirmBtn.waitFor({ state: 'visible' });
      await alertsPage.promptBtn.waitFor({ state: 'visible' });

      await use(alertsPage);
    });
  }
});

test.describe('Alerts Page Suite', () => {

  test('Alert buttons should be displayed on page', async ({ alertsPage }) => {
    await test.step('Verify visibility of all alert buttons', async () => {
      expect(await alertsPage.isElementVisible(alertsPage.alertBtn)).toBe(true);
      expect(await alertsPage.isElementVisible(alertsPage.timerAlertBtn)).toBe(true);
      expect(await alertsPage.isElementVisible(alertsPage.confirmBtn)).toBe(true);
      expect(await alertsPage.isElementVisible(alertsPage.promptBtn)).toBe(true);
    });
  });

  test('Simple alert shows correct message', async ({ alertsPage, page }) => {
    await test.step('Trigger simple alert and validate message', async () => {
      page.once('dialog', async dlg => {
        expect(dlg.type()).toBe('alert');
        expect(dlg.message()).toBe('You clicked a button');
        await dlg.accept();
      });
      await alertsPage.triggerAlert();
    });
  });

  test('Timer alert pops up after delay', async ({ alertsPage, page }) => {
    await test.step('Trigger timer alert and validate delay', async () => {
      const startTime = Date.now();
      page.once('dialog', async dlg => {
        const elapsed = Date.now() - startTime;
        expect(dlg.message()).toBe('This alert appeared after 5 seconds');
        expect(elapsed).toBeGreaterThanOrEqual(5000);
        expect(elapsed).toBeLessThanOrEqual(7000);
        await dlg.accept();
      });
      await alertsPage.triggerTimerAlert();
    });
  });

  test('Confirm alert works with accept action', async ({ alertsPage, page }) => {
    await test.step('Trigger confirm alert and accept', async () => {
      page.once('dialog', async dlg => {
        expect(dlg.type()).toBe('confirm');
        expect(dlg.message()).toBe('Do you confirm action?');
        await dlg.accept();
      });
      await alertsPage.triggerConfirmAlert();
    });

    await test.step('Validate confirm result text after accept', async () => {
      const confirmText = await alertsPage.readConfirmResult();
      expect(confirmText).toContain('You selected Ok');
    });
  });

  test('Confirm alert works with dismiss action', async ({ alertsPage, page }) => {
    await test.step('Trigger confirm alert and dismiss', async () => {
      page.once('dialog', async dlg => {
        expect(dlg.type()).toBe('confirm');
        expect(dlg.message()).toBe('Do you confirm action?');
        await dlg.dismiss();
      });
      await alertsPage.triggerConfirmAlert();
    });

    await test.step('Validate confirm result text after dismiss', async () => {
      const confirmText = await alertsPage.readConfirmResult();
      expect(confirmText).toContain('You selected Cancel');
    });
  });

  test('Prompt alert accepts user input', async ({ alertsPage, page }) => {
    const fakeName = faker.names.name();

    await test.step('Trigger prompt alert and enter name', async () => {
      page.once('dialog', async dlg => {
        expect(dlg.type()).toBe('prompt');
        expect(dlg.message()).toBe('Please enter your name');
        await dlg.accept(fakeName);
      });
      await alertsPage.triggerPromptAlert();
    });

    await test.step('Validate prompt result text with entered name', async () => {
      const promptText = await alertsPage.readPromptResult();
      expect(promptText).toContain(`You entered ${fakeName}`);
    });
  });

  test('Prompt alert disappears when dismissed', async ({ alertsPage, page }) => {
    await test.step('Trigger prompt alert and dismiss', async () => {
      page.once('dialog', async dlg => {
        expect(dlg.type()).toBe('prompt');
        expect(dlg.message()).toBe('Please enter your name');
        await dlg.dismiss();
      });
      await alertsPage.triggerPromptAlert();
    });

    await test.step('Validate prompt result is not visible after dismiss', async () => {
      const isPromptResultVisible = await alertsPage.isElementVisible(alertsPage.promptResultField);
      expect(isPromptResultVisible).toBe(false);
    });
  });

});
