import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { ToolTipsPage } from '../src/pageObjects';

test.describe('ToolTips Page Suite', () => {
  let toolTipsPage;

  test.beforeEach(async ({ page }) => {
    await AdBlocker.blockAds(page);
    toolTipsPage = new ToolTipsPage(page);
    await toolTipsPage.navigateTo('https://demoqa.com/tool-tips');
  });

  // check tooltip on button hover
  test('Tooltip should appear when hovering button', async ({ page }) => {
    await toolTipsPage.moveToButton();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipButton);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipButton);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.readTooltipText(toolTipsPage.tipButton);
    expect(tooltipText).toContain('You hovered over the Button');
  });

  // check tooltip on text field hover
  test('Tooltip should appear when hovering text field', async ({ page }) => {
    await toolTipsPage.moveToInputField();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipInput);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipInput);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.readTooltipText(toolTipsPage.tipInput);
    expect(tooltipText).toContain('You hovered over the text field');
  });

  // check tooltip on Contrary link hover
  test('Tooltip should appear when hovering Contrary link', async ({ page }) => {
    await toolTipsPage.moveToContraryLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipContrary);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipContrary);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.readTooltipText(toolTipsPage.tipContrary);
    expect(tooltipText).toContain('You hovered over the Contrary');
  });

  // check tooltip on Section link hover
  test('Tooltip should appear when hovering Section link', async ({ page }) => {
    await toolTipsPage.moveToSectionLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipSection);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipSection);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.readTooltipText(toolTipsPage.tipSection);
    expect(tooltipText).toContain('You hovered over the 1.10.32');
  });

  // verify all tooltips are unique
  test('All tooltips should have unique text', async ({ page }) => {
    const tooltips = [];

    await toolTipsPage.moveToButton();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tipButton);
    tooltips.push(await toolTipsPage.readTooltipText(toolTipsPage.tipButton));

    await toolTipsPage.moveToInputField();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tipInput);
    tooltips.push(await toolTipsPage.readTooltipText(toolTipsPage.tipInput));

    await toolTipsPage.moveToContraryLink();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tipContrary);
    tooltips.push(await toolTipsPage.readTooltipText(toolTipsPage.tipContrary));

    await toolTipsPage.moveToSectionLink();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tipSection);
    tooltips.push(await toolTipsPage.readTooltipText(toolTipsPage.tipSection));

    const uniqueTooltips = new Set(tooltips);
    expect(uniqueTooltips.size).toBe(4);
    expect(tooltips.length).toBe(4);
  });

  // aria-describedby check for button
  test('Button should have aria-describedby on hover', async ({ page }) => {
    await toolTipsPage.moveToButton();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipButton);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipButton);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.btnHover.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('buttonToolTip');
  });

  // aria-describedby check for text field
  test('Text field should have aria-describedby on hover', async ({ page }) => {
    await toolTipsPage.moveToInputField();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipInput);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipInput);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.inputHover.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('textFieldToolTip');
  });

  // aria-describedby check for Contrary link
  test('Contrary link should have aria-describedby on hover', async ({ page }) => {
    await toolTipsPage.moveToContraryLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipContrary);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipContrary);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.linkContrary.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('contraryTexToolTip');
  });

  // aria-describedby check for Section link
  test('Section link should have aria-describedby on hover', async ({ page }) => {
    await toolTipsPage.moveToSectionLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tipSection);
    const isVisible = await toolTipsPage.checkTooltipVisible(toolTipsPage.tipSection);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.linkSection.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('sectionToolTip');
  });
});
