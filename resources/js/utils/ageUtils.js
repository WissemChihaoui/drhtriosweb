// ageUtils.js

export function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  export function groupByAgeAndGender(employees) {
    const ageGenderData = {
      Homme: {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46+': 0,
      },
      Femme: {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46+': 0,
      }
    };
  
    employees.forEach(employee => {
      const age = calculateAge(employee.birthdate);
      const gender = employee.gender; // Assuming "Homme" or "Femme"
  
      if (age >= 18 && age <= 25) {
        ageGenderData[gender]['18-25']++;
      } else if (age >= 26 && age <= 35) {
        ageGenderData[gender]['26-35']++;
      } else if (age >= 36 && age <= 45) {
        ageGenderData[gender]['36-45']++;
      } else if (age >= 46) {
        ageGenderData[gender]['46+']++;
      }
    });
  
    return ageGenderData;
  }
  