import Fakerator from "fakerator";

export default class DataGenerator {
  constructor(locale = "en-US") {
    this.fakerator = new Fakerator(locale);

    this.genders = ["Male", "Female", "Other"];

    this.hobbies = ["Sports", "Reading", "Music"];

    this.subjects = [
      "Maths",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Economics",
      "Arts",
      "Computer Science"
    ];

    this.states = ["NCR", "Uttar Pradesh", "Haryana", "Rajasthan"];

    this.cities = {
      NCR: ["Delhi", "Gurgaon", "Noida"],
      "Uttar Pradesh": ["Lucknow", "Merrut"],
      Haryana: ["Karnal", "Panipat"],
      Rajasthan: ["Jaipur", "Jaiselmer"]
    };
  }

  generateFirstName() {
    return this.fakerator.names.firstName();
  }

  generateLastName() {
    return this.fakerator.names.lastName();
  }

  generateEmail() {
    return this.fakerator.internet.email();
  }

  generateGender() {
    return this.fakerator.random.arrayElement(this.genders);
  }

  generateMobile() {
    return this.fakerator.random.number(1000000000, 9999999999).toString();
  }

  generateSubjects(count = 2) {
    const selected = [];
    const available = [...this.subjects];

    for (let i = 0; i < count; i++) {
      const subject = this.fakerator.random.arrayElement(available);
      selected.push(subject);
      available.splice(available.indexOf(subject), 1);
    }
    return selected;
  }

  generateHobbies(count = 2) {
    const selected = [];
    const available = [...this.hobbies];

    for (let i = 0; i < count; i++) {
      const hobby = this.fakerator.random.arrayElement(available);
      selected.push(hobby);
      available.splice(available.indexOf(hobby), 1);
    }
    return selected;
  }

  generateAddress() {
    return this.fakerator.address.street();
  }

  generateStateAndCity() {
    const state = this.fakerator.random.arrayElement(this.states);
    const city = this.fakerator.random.arrayElement(this.cities[state]);
    return { state, city };
  }

  generateCompleteFormData() {
    const { state, city } = this.generateStateAndCity();
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      email: this.generateEmail(),
      gender: this.generateGender(),
      mobile: this.generateMobile(),
      subjects: this.generateSubjects(),
      hobbies: this.generateHobbies(),
      address: this.generateAddress(),
      state,
      city
    };
  }

  generateMandatoryFormData() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      gender: this.generateGender(),
      mobile: this.generateMobile()
    };
  }

  generateFormDataWithInvalidEmail() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      email: "invalid-email",
      gender: this.generateGender(),
      mobile: this.generateMobile()
    };
  }

  generateFormDataWithInvalidMobile() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      gender: this.generateGender(),
      mobile: "12345"
    };
  }
}
