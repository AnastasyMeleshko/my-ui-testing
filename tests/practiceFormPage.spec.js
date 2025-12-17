import { test, expect } from '@playwright/test';
import { AdBlocker, DataGenerator } from '../src/utils';
import FormPage from '../src/pageObjects/PracticeFormPage';
import path from 'path';

test.describe('Practice Form Page Tests', () => {
  let formPage;
  let dataGenerator;

  test.beforeEach(async ({ page }) => {
    // Block ads before running tests
    await AdBlocker.blockAds(page);

    // Initialize page object and data generator
    formPage = new FormPage(page);
    dataGenerator = new DataGenerator('en-US');

    // Navigate to the practice form page
    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
    });
  });

  test.describe('Positive Scenarios', () => {
    test('Complete form submission with all fields', async ({ page }) => {
      // Generate complete test data
      const formData = dataGenerator.generateCompleteFormData();

      // Path to test image file
      const filePath = path.resolve(__dirname, '../assets/images/test.jpeg');

      // Fill all form fields
      await formPage.fillAll(formData);

      // Upload picture
      await page.setInputFiles('#uploadPicture', filePath);

      // Submit the form
      await formPage.submitForm();

      // Wait until modal is visible
      await formPage.waitForElementVisible(formPage.modalBox);
      expect(await formPage.isModalShown()).toBe(true);

      // Validate modal header text
      const modalTitle = await formPage.getModalHeaderText();
      expect(modalTitle).toContain('Thanks for submitting the form');

      // Validate student name
      const studentName = await formPage.getResult('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      // Validate email
      const email = await formPage.getResult('Student Email');
      expect(email).toBe(formData.email);

      // Validate gender
      const gender = await formPage.getResult('Gender');
      expect(gender).toBe(formData.gender);

      // Validate mobile number
      const mobile = await formPage.getResult('Mobile');
      expect(mobile).toBe(formData.mobile);

      // Validate subjects
      const subjects = await formPage.getResult('Subjects');
      formData.subjects.forEach(subject => {
        expect(subjects).toContain(subject);
      });

      // Validate hobbies
      const hobbies = await formPage.getResult('Hobbies');
      formData.hobbies.forEach(hobby => {
        expect(hobbies).toContain(hobby);
      });

      // Validate uploaded picture name
      const pictureName = await formPage.getResult('Picture');
      expect(pictureName).toContain('test.jpeg');

      // Validate address
      const address = await formPage.getResult('Address');
      expect(address).toBe(formData.address);

      // Validate state and city
      const stateCity = await formPage.getResult('State and City');
      expect(stateCity).toContain(formData.state);
      expect(stateCity).toContain(formData.city);
    });

    test('Submission with only mandatory fields', async () => {
      // Generate mandatory-only test data
      const formData = dataGenerator.generateMandatoryFormData();

      // Fill only required fields
      await formPage.fillRequired(formData);

      // Submit the form
      await formPage.submitForm();

      // Wait until modal is visible
      await formPage.waitForElementVisible(formPage.modalBox);
      expect(await formPage.isModalShown()).toBe(true);

      // Validate modal header text
      const modalTitle = await formPage.getModalHeaderText();
      expect(modalTitle).toContain('Thanks for submitting the form');

      // Validate student name
      const studentName = await formPage.getResult('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      // Validate gender
      const gender = await formPage.getResult('Gender');
      expect(gender).toBe(formData.gender);

      // Validate mobile number
      const mobile = await formPage.getResult('Mobile');
      expect(mobile).toBe(formData.mobile);
    });
  });

  // Run tests for each gender option
  const genders = new DataGenerator().genders;
  for (const gender of genders) {
    test(`Form submission with gender: ${gender}`, async () => {
      // Generate minimal data with specific gender
      const formData = {
        firstName: dataGenerator.generateFirstName(),
        lastName: dataGenerator.generateLastName(),
        gender: gender,
        mobile: dataGenerator.generateMobile(),
      };

      // Fill required fields
      await formPage.fillRequired(formData);

      // Submit the form
      await formPage.submitForm();

      // Validate that modal is shown
      expect(await formPage.isModalShown()).toBe(true);
    });
  }
});
