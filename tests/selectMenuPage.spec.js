import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { SelectMenuPage } from '../src/pageObjects';
import data from '../config/constants';

test.describe('Select Menu Page Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    await AdBlocker.blockAds(page);
    selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.navigateTo('https://demoqa.com/select-menu');
  });

  test('Choose value dropdown option: Group 2, option 1', async ({ page }) => {
    await selectMenuPage.chooseValue('Group 2, option 1');

    const selectedText = await selectMenuPage.readSelectedValue(selectMenuPage.valueDropdown);
    expect(selectedText).toContain('Group 2, option 1');
  });

  test('Choose single dropdown option: Other', async ({ page }) => {
    await selectMenuPage.chooseSingle('Other');

    const selectedText = await selectMenuPage.readSelectedValue(selectMenuPage.singleDropdown);
    expect(selectedText).toContain('Other');
  });

  test('Choose old style select option: Green', async ({ page }) => {
    await selectMenuPage.chooseOldStyle('Green');

    const selectedText = await selectMenuPage.readOldStyleSelected();
    expect(selectedText).toBe('Green');
  });

  test('Choose multiple options in standard multiselect', async ({ page }) => {
    await selectMenuPage.chooseMultiOptions(['Volvo', 'Audi']);

    const selectedOptions = await selectMenuPage.multiSelectChecked.allInnerTexts();
    expect(selectedOptions).toEqual(expect.arrayContaining(['Volvo', 'Audi']));
    expect(selectedOptions).toHaveLength(2);
  });

  test('Choose two colors in react multiselect', async ({ page }) => {
    await selectMenuPage.chooseReactMultiOptions(['Black', 'Blue']);

    await expect(selectMenuPage.reactMultiTagLabels).toHaveCount(2);

    const labels = await selectMenuPage.reactMultiTagLabels.allInnerTexts();
    expect(labels).toEqual(expect.arrayContaining(['Black', 'Blue']));
  });

  test('Choose three colors in react multiselect', async ({ page }) => {
    await selectMenuPage.chooseReactMultiOptions(['Green', 'Blue', 'Black']);

    await expect(selectMenuPage.reactMultiTagLabels).toHaveCount(3);

    const labels = await selectMenuPage.reactMultiTagLabels.allInnerTexts();
    expect(labels).toEqual(expect.arrayContaining(['Green', 'Blue', 'Black']));
  });

  test('Verify all dropdown menus are visible', async ({ page }) => {
    await selectMenuPage.valueDropdown.waitFor({ state: 'visible' });

    expect(await selectMenuPage.isElementVisible(selectMenuPage.valueDropdown)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.singleDropdown)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.oldSelect)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.reactMultiControl)).toBe(true);
  });

  for (const color of data.colors) {
    test(`Choose old style select option: ${color} (single test)`, async ({ page }) => {
      await selectMenuPage.chooseOldStyle(color);

      const selectedText = await selectMenuPage.readOldStyleSelected();
      expect(selectedText).toBe(color);
    });
  }

  test('Clear all selected tags in react multiselect', async ({ page }) => {
    await selectMenuPage.chooseReactMultiOptions(['Black', 'Blue']);

    // initially 2 tags
    await expect(selectMenuPage.reactMultiTags).toHaveCount(2);

    // remove tags one by one
    const removeButtons = selectMenuPage.reactMultiRemoveBtns;
    const count = await removeButtons.count();

    for (let i = count - 1; i >= 0; i--) {
      await selectMenuPage.clickOnElementByLocator(removeButtons.nth(i));
    }

    await expect(selectMenuPage.reactMultiTags).toHaveCount(0);
  });
});
