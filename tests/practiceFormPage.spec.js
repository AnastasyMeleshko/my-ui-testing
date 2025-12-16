import { test, expect } from '@playwright/test';
import { AdBlocker, DataGenerator } from '../src/utils';
import FormPage from '../src/pageObjects/PracticeFormPage';
import path from 'path';

test.describe('Practice Form Page Tests', () => {
  let formPage;
  let dataGenerator;

  test.beforeEach(async ({ page }) => {
    await AdBlocker.blockAds(page);
    formPage = new FormPage(page);
    dataGenerator = new DataGenerator('en-US');
    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
    });
  });

  test.describe('Positive Scenarios', () => {
    test('Complete form submission with all fields', async ({ page }) => {
      const formData = dataGenerator.generateCompleteFormData();

      // путь к тестовому файлу
      const filePath = path.resolve(__dirname, '../assets/images/test.jpeg');

      // заполняем все поля
      await formPage.fillAll(formData);

      // загружаем картинку
      await page.setInputFiles('#uploadPicture', filePath);

      // сабмитим форму
      await formPage.submitForm();

      await formPage.waitForElementVisible(formPage.modalBox);
      expect(await formPage.isModalShown()).toBe(true);

      const modalTitle = await formPage.getModalHeaderText();
      expect(modalTitle).toContain('Thanks for submitting the form');

      const studentName = await formPage.getResult('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      const email = await formPage.getResult('Student Email');
      expect(email).toBe(formData.email);

      const gender = await formPage.getResult('Gender');
      expect(gender).toBe(formData.gender);

      const mobile = await formPage.getResult('Mobile');
      expect(mobile).toBe(formData.mobile);

      const subjects = await formPage.getResult('Subjects');
      formData.subjects.forEach(subject => {
        expect(subjects).toContain(subject);
      });

      const hobbies = await formPage.getResult('Hobbies');
      formData.hobbies.forEach(hobby => {
        expect(hobbies).toContain(hobby);
      });

      const pictureName = await formPage.getResult('Picture');
      expect(pictureName).toContain('test.jpeg');

      const address = await formPage.getResult('Address');
      expect(address).toBe(formData.address);

      const stateCity = await formPage.getResult('State and City');
      expect(stateCity).toContain(formData.state);
      expect(stateCity).toContain(formData.city);
    });

    test('Submission with only mandatory fields', async () => {
      const formData = dataGenerator.generateMandatoryFormData();

      await formPage.fillRequired(formData);

      await formPage.submitForm();

      await formPage.waitForElementVisible(formPage.modalBox);
      expect(await formPage.isModalShown()).toBe(true);

      const modalTitle = await formPage.getModalHeaderText();
      expect(modalTitle).toContain('Thanks for submitting the form');

      const studentName = await formPage.getResult('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      const gender = await formPage.getResult('Gender');
      expect(gender).toBe(formData.gender);

      const mobile = await formPage.getResult('Mobile');
      expect(mobile).toBe(formData.mobile);
    });
  });

  const genders = new DataGenerator().genders;
  for (const gender of genders) {
    test(`Form submission with gender: ${gender}`, async () => {
      const formData = {
        firstName: dataGenerator.generateFirstName(),
        lastName: dataGenerator.generateLastName(),
        gender: gender,
        mobile: dataGenerator.generateMobile(),
      };

      await formPage.fillRequired(formData);
      await formPage.submitForm();

      expect(await formPage.isModalShown()).toBe(true);
    });
  }
});
