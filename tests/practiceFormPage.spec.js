import { test, expect } from '@playwright/test';
import { AdBlocker, DataGenerator } from '../src/utils';
import FormPage from '../src/pageObjects/PracticeFormPage';
import path from 'path';

test.describe('Practice Form Page Tests', () => {
  let formPage;
  let dataGenerator;

  test.beforeEach(async ({ page }) => {
    await test.step('Block ads before running tests', async () => {
      await AdBlocker.blockAds(page);
    });

    await test.step('Initialize page object and data generator', async () => {
      formPage = new FormPage(page);
      dataGenerator = new DataGenerator('en-US');
    });

    await test.step('Navigate to the practice form page', async () => {
      await page.goto('https://demoqa.com/automation-practice-form', {
        waitUntil: 'domcontentloaded',
      });
    });
  });

  test.describe('Positive Scenarios', () => {
    test('Complete form submission with all fields', async ({ page }) => {
      const formData = await test.step('Generate complete test data', async () => {
        return dataGenerator.generateCompleteFormData();
      });

      const filePath = await test.step('Resolve path to test image file', async () => {
        return path.resolve(__dirname, '../assets/images/test.jpeg');
      });

      await test.step('Fill all form fields', async () => {
        await formPage.fillAll(formData);
      });

      await test.step('Upload picture', async () => {
        await page.setInputFiles('#uploadPicture', filePath);
      });

      await test.step('Submit the form', async () => {
        await formPage.submitForm();
      });

      await test.step('Wait until modal is visible', async () => {
        await formPage.waitForElementVisible(formPage.modalBox);
        expect(await formPage.isModalShown()).toBe(true);
      });

      await test.step('Validate modal header text', async () => {
        const modalTitle = await formPage.getModalHeaderText();
        expect(modalTitle).toContain('Thanks for submitting the form');
      });

      await test.step('Validate student name', async () => {
        const studentName = await formPage.getResult('Student Name');
        expect(studentName).toContain(formData.firstName);
        expect(studentName).toContain(formData.lastName);
      });

      await test.step('Validate email', async () => {
        const email = await formPage.getResult('Student Email');
        expect(email).toBe(formData.email);
      });

      await test.step('Validate gender', async () => {
        const gender = await formPage.getResult('Gender');
        expect(gender).toBe(formData.gender);
      });

      await test.step('Validate mobile number', async () => {
        const mobile = await formPage.getResult('Mobile');
        expect(mobile).toBe(formData.mobile);
      });

      await test.step('Validate subjects', async () => {
        const subjects = await formPage.getResult('Subjects');
        formData.subjects.forEach(subject => {
          expect(subjects).toContain(subject);
        });
      });

      await test.step('Validate hobbies', async () => {
        const hobbies = await formPage.getResult('Hobbies');
        formData.hobbies.forEach(hobby => {
          expect(hobbies).toContain(hobby);
        });
      });

      await test.step('Validate uploaded picture name', async () => {
        const pictureName = await formPage.getResult('Picture');
        expect(pictureName).toContain('test.jpeg');
      });

      await test.step('Validate address', async () => {
        const address = await formPage.getResult('Address');
        expect(address).toBe(formData.address);
      });

      await test.step('Validate state and city', async () => {
        const stateCity = await formPage.getResult('State and City');
        expect(stateCity).toContain(formData.state);
        expect(stateCity).toContain(formData.city);
      });
    });

    test('Submission with only mandatory fields', async () => {
      const formData = await test.step('Generate mandatory-only test data', async () => {
        return dataGenerator.generateMandatoryFormData();
      });

      await test.step('Fill only required fields', async () => {
        await formPage.fillRequired(formData);
      });

      await test.step('Submit the form', async () => {
        await formPage.submitForm();
      });

      await test.step('Wait until modal is visible', async () => {
        await formPage.waitForElementVisible(formPage.modalBox);
        expect(await formPage.isModalShown()).toBe(true);
      });

      await test.step('Validate modal header text', async () => {
        const modalTitle = await formPage.getModalHeaderText();
        expect(modalTitle).toContain('Thanks for submitting the form');
      });

      await test.step('Validate student name', async () => {
        const studentName = await formPage.getResult('Student Name');
        expect(studentName).toContain(formData.firstName);
        expect(studentName).toContain(formData.lastName);
      });

      await test.step('Validate gender', async () => {
        const gender = await formPage.getResult('Gender');
        expect(gender).toBe(formData.gender);
      });

      await test.step('Validate mobile number', async () => {
        const mobile = await formPage.getResult('Mobile');
        expect(mobile).toBe(formData.mobile);
      });
    });
  });

  const genders = new DataGenerator().genders;
  for (const gender of genders) {
    test(`Form submission with gender: ${gender}`, async () => {
      const formData = await test.step('Generate minimal data with specific gender', async () => {
        return {
          firstName: dataGenerator.generateFirstName(),
          lastName: dataGenerator.generateLastName(),
          gender: gender,
          mobile: dataGenerator.generateMobile(),
        };
      });

      await test.step('Fill required fields', async () => {
        await formPage.fillRequired(formData);
      });

      await test.step('Submit the form', async () => {
        await formPage.submitForm();
      });

      await test.step('Validate that modal is shown', async () => {
        expect(await formPage.isModalShown()).toBe(true);
      });
    });
  }
});
