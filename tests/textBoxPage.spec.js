import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { TextBoxPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

// Initialize Fakerator with Lithuanian locale
const fakerator = Fakerator('lt-LT');

test.describe('Text Box Page Suite', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    // Block ads before running tests
    await AdBlocker.blockAds(page);

    // Initialize page object
    textBoxPage = new TextBoxPage(page);

    // Navigate to the Text Box page
    await textBoxPage.navigateTo('https://demoqa.com/text-box');

    // Ensure required fields are visible before test execution
    await page.locator('#userName').waitFor({ state: 'visible' });
    await page.locator('#userEmail').waitFor({ state: 'visible' });
  });

  test('Verify all form fields are visible', async () => {
    // Check visibility of all form elements
    expect(await textBoxPage.isElementVisible(textBoxPage.nameField)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.mailField)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.addrCurrent)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.addrPermanent)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.btnSubmit)).toBe(true);
  });

  test('Fill form with random data and validate output', async () => {
    // Generate random test data
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const currentAddress = fakerator.address.street();
    const permanentAddress = fakerator.address.street();

    // Complete the form with generated data
    await textBoxPage.completeForm(fullName, email, currentAddress, permanentAddress);

    // Wait until result box is visible
    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
    expect(await textBoxPage.isResultVisible()).toBe(true);

    // Validate output values
    const outputName = await textBoxPage.readResultName();
    const outputEmail = await textBoxPage.readResultMail();
    const outputCurrentAddr = await textBoxPage.readResultCurrentAddr();
    const outputPermanentAddr = await textBoxPage.readResultPermanentAddr();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
    expect(outputCurrentAddr).toContain(currentAddress);
    expect(outputPermanentAddr).toContain(permanentAddress);
  });

  test('Fill only required fields and submit', async () => {
    // Generate random name and email
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();

    // Fill only required fields
    await textBoxPage.typeName(fullName);
    await textBoxPage.typeMail(email);
    await textBoxPage.pressSubmit();

    // Wait until result box is visible
    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    // Validate output
    const outputName = await textBoxPage.readResultName();
    const outputEmail = await textBoxPage.readResultMail();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
  });

  test('Submit button should be clickable', async () => {
    const fullName = fakerator.names.name();

    // Fill only name field
    await textBoxPage.typeName(fullName);

    // Press submit
    await textBoxPage.pressSubmit();

    // Verify result box is visible
    expect(await textBoxPage.isResultVisible()).toBe(true);
  });

  test('Form should handle special characters in address', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const specialAddress = '123 LONG St., SRWQG #456, NEW-YORK, State 123456789';

    // Fill form with special characters in address
    await textBoxPage.completeForm(fullName, email, specialAddress, specialAddress);

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    // Validate special characters are preserved
    const outputCurrentAddr = await textBoxPage.readResultCurrentAddr();
    expect(outputCurrentAddr).toContain(specialAddress);
  });

  test('Invalid email should show error state', async () => {
    const invalidEmail = 's@';

    // Fill invalid email
    await textBoxPage.typeMail(invalidEmail);
    await textBoxPage.pressSubmit();

    // Validate error state
    const hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(true);

    await expect(textBoxPage.mailFieldWithError).toBeVisible();
    await expect(textBoxPage.mailFieldWithError).toHaveCSS('border-color', 'rgb(255, 0, 0)');
  });

  test('Incomplete email without domain should show error', async () => {
    const invalidEmails = ['s@', 'test@', 'user@', '@'];

    for (const invalidEmail of invalidEmails) {
      // Clear field before each test
      await textBoxPage.mailField.fill('');
      await textBoxPage.typeMail(invalidEmail);
      await textBoxPage.pressSubmit();

      // Validate error state
      const hasErrorClass = await textBoxPage.hasMailError();
      expect(hasErrorClass).toBe(true);
    }
  });

  test('Valid email should remove error state', async () => {
    const invalidEmail = 's@';
    const validEmail = 's@gmail.com';

    // First submit invalid email
    await textBoxPage.typeMail(invalidEmail);
    await textBoxPage.pressSubmit();

    let hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(true);

    // Clear and submit valid email
    await textBoxPage.mailField.fill('');
    await textBoxPage.typeMail(validEmail);
    await textBoxPage.pressSubmit();

    hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(false);

    // Validate output contains valid email
    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
    const outputEmail = await textBoxPage.readResultMail();
    expect(outputEmail).toContain(validEmail);
  });

  test('Valid email formats should not show error', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.lt',
      'test12345@test-domain.com',
      's@mail.co'
    ];

    for (const validEmail of validEmails) {
      await textBoxPage.mailField.fill('');
      await textBoxPage.typeMail(validEmail);
      await textBoxPage.pressSubmit();

      // Validate no error state
      const hasErrorClass = await textBoxPage.hasMailError();
      expect(hasErrorClass).toBe(false);
    }
  });

  test('Empty form submission should not show output', async () => {
    // Submit empty form
    await textBoxPage.pressSubmit();

    // Validate no output is shown
    const isOutputVisible = await textBoxPage.isResultVisible();
    expect(isOutputVisible).toBe(false);
  });

  test('Submit form with only full name filled', async () => {
    const fullName = fakerator.names.name();

    // Fill only name field
    await textBoxPage.typeName(fullName);
    await textBoxPage.pressSubmit();

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    // Validate only name is shown in output
    const outputName = await textBoxPage.readResultName();
    expect(outputName).toContain(fullName);

    // Other fields should not be visible
    expect(await textBoxPage.isElementVisible(textBoxPage.resultMail)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrCurrent)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrPermanent)).toBe(false);
  });
});
