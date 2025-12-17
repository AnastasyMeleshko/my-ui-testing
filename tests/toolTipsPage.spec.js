import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { ToolTipsPage } from '../src/pageObjects';

test.describe('ToolTips Page Suite', () => {
  let toolTipsPage;

  test.beforeEach(async ({ page }) => {
    await test.step('Block ads on the page', async () => {
      await AdBlocker.blockAds(page);
    });

    await test.step('Initialize ToolTips page object', async () => {
      toolTipsPage = new ToolTipsPage(page);
    });

    await test.step('Navigate to Tool Tips page', async () => {
      await toolTipsPage.navigateTo('https://demoqa.com/tool-tips');
    });
  });

  /* ================= TOOLTIP TEXT TESTS ================= */

  test('Tooltip should appear when hovering button', async () => {
    await test.step('Hover over button', async () => {
      await toolTipsPage.moveToButton();
    });

    await test.step('Verify tooltip is visible and text is correct', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipButton);
      const text = await toolTipsPage.readTooltipText(toolTipsPage.tipButton);
      expect(text).toContain('You hovered over the Button');
    });
  });

  test('Tooltip should appear when hovering text field', async () => {
    await test.step('Hover over text field', async () => {
      await toolTipsPage.moveToInputField();
    });

    await test.step('Verify tooltip is visible and text is correct', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipInput);
      const text = await toolTipsPage.readTooltipText(toolTipsPage.tipInput);
      expect(text).toContain('You hovered over the text field');
    });
  });

  test('Tooltip should appear when hovering Contrary link', async () => {
    await test.step('Hover over Contrary link', async () => {
      await toolTipsPage.moveToContraryLink();
    });

    await test.step('Verify tooltip is visible and text is correct', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipContrary);
      const text = await toolTipsPage.readTooltipText(toolTipsPage.tipContrary);
      expect(text).toContain('You hovered over the Contrary');
    });
  });

  test('Tooltip should appear when hovering Section link', async () => {
    await test.step('Hover over Section link', async () => {
      await toolTipsPage.moveToSectionLink();
    });

    await test.step('Verify tooltip is visible and text is correct', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipSection);
      const text = await toolTipsPage.readTooltipText(toolTipsPage.tipSection);
      expect(text).toContain('You hovered over the 1.10.32');
    });
  });

  /* ================= aria-describedby TESTS ================= */

  test('Button should have aria-describedby on hover', async () => {
    await test.step('Hover over button', async () => {
      await toolTipsPage.moveToButton();
    });

    await test.step('Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipButton);
    });

    await test.step('Verify aria-describedby attribute', async () => {
      const aria = await toolTipsPage.btnHover.getAttribute('aria-describedby');
      expect(aria).toBe('buttonToolTip');
    });
  });

  test('Text field should have aria-describedby on hover', async () => {
    await test.step('Hover over text field', async () => {
      await toolTipsPage.moveToInputField();
    });

    await test.step('Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipInput);
    });

    await test.step('Verify aria-describedby attribute', async () => {
      const aria = await toolTipsPage.inputHover.getAttribute('aria-describedby');
      expect(aria).toBe('textFieldToolTip');
    });
  });

  test('Contrary link should have aria-describedby on hover', async () => {
    await test.step('Hover over Contrary link', async () => {
      await toolTipsPage.moveToContraryLink();
    });

    await test.step('Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipContrary);
    });

    await test.step('Verify aria-describedby attribute', async () => {
      const aria = await toolTipsPage.linkContrary.getAttribute('aria-describedby');
      expect(aria).toBe('contraryTexToolTip');
    });
  });

  test('Section link should have aria-describedby on hover', async () => {
    await test.step('Hover over Section link', async () => {
      await toolTipsPage.moveToSectionLink();
    });

    await test.step('Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tipSection);
    });

    await test.step('Verify aria-describedby attribute', async () => {
      const aria = await toolTipsPage.linkSection.getAttribute('aria-describedby');
      expect(aria).toBe('sectionToolTip');
    });
  });
});
