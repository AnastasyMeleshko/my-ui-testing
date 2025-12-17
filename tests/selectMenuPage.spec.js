import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { SelectMenuPage } from '../src/pageObjects';
import data from '../config/constants';

test.describe('Select Menu Page Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    await test.step('Block ads and navigate to Select Menu page', async () => {
      await AdBlocker.blockAds(page);
      selectMenuPage = new SelectMenuPage(page);
      await selectMenuPage.navigateTo('https://demoqa.com/select-menu');
    });
  });

  test('Choose value dropdown option: Group 2, option 1', async ({ page }) => {
    await test.step('Select value from dropdown', async () => {
      await selectMenuPage.chooseValue('Group 2, option 1');
    });

    await test.step('Validate selected value', async () => {
      const selectedText = await selectMenuPage.readSelectedValue(selectMenuPage.valueDropdown);
      expect(selectedText).toContain('Group 2, option 1');
    });
  });

  test('Choose single dropdown option: Other', async ({ page }) => {
    await test.step('Select single dropdown option', async () => {
      await selectMenuPage.chooseSingle('Other');
    });

    await test.step('Validate selected option', async () => {
      const selectedText = await selectMenuPage.readSelectedValue(selectMenuPage.singleDropdown);
      expect(selectedText).toContain('Other');
    });
  });

  test('Choose old style select option: Green', async ({ page }) => {
    await test.step('Select old style option', async () => {
      await selectMenuPage.chooseOldStyle('Green');
    });

    await test.step('Validate old style selected option', async () => {
      const selectedText = await selectMenuPage.readOldStyleSelected();
      expect(selectedText).toBe('Green');
    });
  });

  test('Choose multiple options in standard multiselect', async ({ page }) => {
    await test.step('Select multiple options in standard multiselect', async () => {
      await selectMenuPage.chooseMultiOptions(['Volvo', 'Audi']);
    });

    await test.step('Validate selected options', async () => {
      const selectedOptions = await selectMenuPage.multiSelectChecked.allInnerTexts();
      expect(selectedOptions).toEqual(expect.arrayContaining(['Volvo', 'Audi']));
      expect(selectedOptions).toHaveLength(2);
    });
  });

  test('Choose two colors in react multiselect', async ({ page }) => {
    await test.step('Select two colors in react multiselect', async () => {
      await selectMenuPage.chooseReactMultiOptions(['Black', 'Blue']);
    });

    await test.step('Validate selected colors', async () => {
      await expect(selectMenuPage.reactMultiTagLabels).toHaveCount(2);
      const labels = await selectMenuPage.reactMultiTagLabels.allInnerTexts();
      expect(labels).toEqual(expect.arrayContaining(['Black', 'Blue']));
    });
  });

  test('Choose three colors in react multiselect', async ({ page }) => {
    await test.step('Select three colors in react multiselect', async () => {
      await selectMenuPage.chooseReactMultiOptions(['Green', 'Blue', 'Black']);
    });

    await test.step('Validate selected colors', async () => {
      await expect(selectMenuPage.reactMultiTagLabels).toHaveCount(3);
      const labels = await selectMenuPage.reactMultiTagLabels.allInnerTexts();
      expect(labels).toEqual(expect.arrayContaining(['Green', 'Blue', 'Black']));
    });
  });

  test('Verify all dropdown menus are visible', async ({ page }) => {
    await test.step('Wait for value dropdown to be visible', async () => {
      await selectMenuPage.valueDropdown.waitFor({ state: 'visible' });
    });

    await test.step('Validate visibility of all dropdowns', async () => {
      expect(await selectMenuPage.isElementVisible(selectMenuPage.valueDropdown)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.singleDropdown)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.oldSelect)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.reactMultiControl)).toBe(true);
    });
  });

  for (const color of data.colors) {
    test(`Choose old style select option: ${color} (single test)`, async ({ page }) => {
      await test.step(`Select old style option: ${color}`, async () => {
        await selectMenuPage.chooseOldStyle(color);
      });

      await test.step('Validate selected old style option', async () => {
        const selectedText = await selectMenuPage.readOldStyleSelected();
        expect(selectedText).toBe(color);
      });
    });
  }

  test('Clear all selected tags in react multiselect', async ({ page }) => {
    await test.step('Select two colors in react multiselect', async () => {
      await selectMenuPage.chooseReactMultiOptions(['Black', 'Blue']);
    });

    await test.step('Validate initial tag count', async () => {
      await expect(selectMenuPage.reactMultiTags).toHaveCount(2);
    });

    await test.step('Remove tags one by one', async () => {
      const removeButtons = selectMenuPage.reactMultiRemoveBtns;
      const count = await removeButtons.count();
      for (let i = count - 1; i >= 0; i--) {
        await selectMenuPage.clickOnElementByLocator(removeButtons.nth(i));
      }
    });

    await test.step('Validate all tags are cleared', async () => {
      await expect(selectMenuPage.reactMultiTags).toHaveCount(0);
    });
  });
});
