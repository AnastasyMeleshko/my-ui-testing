import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { AlertsPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

const faker = Fakerator('lt-LT');

test.describe('Alerts Page Suite', () => {
  let pageAlerts;

  test.beforeEach(async ({ page }) => {
    await AdBlocker.blockAds(page);
    pageAlerts = new AlertsPage(page);
    await pageAlerts.navigateTo('https://demoqa.com/alerts');

    await pageAlerts.alertBtn.waitFor({ state: 'visible' });
    await pageAlerts.timerAlertBtn.waitFor({ state: 'visible' });
    await pageAlerts.confirmBtn.waitFor({ state: 'visible' });
    await pageAlerts.promptBtn.waitFor({ state: 'visible' });
  });

  test('Alert buttons should be displayed on page', async () => {
    expect(await pageAlerts.isElementVisible(pageAlerts.alertBtn)).toBe(true);
    expect(await pageAlerts.isElementVisible(pageAlerts.timerAlertBtn)).toBe(true);
    expect(await pageAlerts.isElementVisible(pageAlerts.confirmBtn)).toBe(true);
    expect(await pageAlerts.isElementVisible(pageAlerts.promptBtn)).toBe(true);
  });

  test('Simple alert shows correct message', async ({ page }) => {
    page.once('dialog', async dlg => {
      expect(dlg.type()).toBe('alert');
      expect(dlg.message()).toBe('You clicked a button');
      await dlg.accept();
    });
    await pageAlerts.triggerAlert();
  });

  test('Timer alert pops up after delay', async ({ page }) => {
    const startTime = Date.now();
    page.once('dialog', async dlg => {
      const elapsed = Date.now() - startTime;
      expect(dlg.message()).toBe('This alert appeared after 5 seconds');
      expect(elapsed).toBeGreaterThanOrEqual(5000);
      expect(elapsed).toBeLessThanOrEqual(7000);
      await dlg.accept();
    });
    await pageAlerts.triggerTimerAlert();
  });

  test('Confirm alert works with accept action', async ({ page }) => {
    page.once('dialog', async dlg => {
      expect(dlg.type()).toBe('confirm');
      expect(dlg.message()).toBe('Do you confirm action?');
      await dlg.accept();
    });
    await pageAlerts.triggerConfirmAlert();
    const confirmText = await pageAlerts.readConfirmResult();
    expect(confirmText).toContain('You selected Ok');
  });

  test('Confirm alert works with dismiss action', async ({ page }) => {
    page.once('dialog', async dlg => {
      expect(dlg.type()).toBe('confirm');
      expect(dlg.message()).toBe('Do you confirm action?');
      await dlg.dismiss();
    });
    await pageAlerts.triggerConfirmAlert();
    const confirmText = await pageAlerts.readConfirmResult();
    expect(confirmText).toContain('You selected Cancel');
  });

  test('Prompt alert accepts user input', async ({ page }) => {
    const fakeName = faker.names.name();
    page.once('dialog', async dlg => {
      expect(dlg.type()).toBe('prompt');
      expect(dlg.message()).toBe('Please enter your name');
      await dlg.accept(fakeName);
    });
    await pageAlerts.triggerPromptAlert();
    const promptText = await pageAlerts.readPromptResult();
    expect(promptText).toContain(`You entered ${fakeName}`);
  });

  test('Prompt alert disappears when dismissed', async ({ page }) => {
    page.once('dialog', async dlg => {
      expect(dlg.type()).toBe('prompt');
      expect(dlg.message()).toBe('Please enter your name');
      await dlg.dismiss();
    });
    await pageAlerts.triggerPromptAlert();
    const isPromptResultVisible = await pageAlerts.isElementVisible(pageAlerts.promptResultField);
    expect(isPromptResultVisible).toBe(false);
  });
});
