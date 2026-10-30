export function seedDemoData(stores) {
  const {
    familyStore, healthStore, financeStore, educationStore,
    documentsStore, placesStore, permissionsStore,
  } = stores;

  familyStore.getState().createFamily('The Sharma Family', 'A loving family of five', 'India');

  const memberDefs = [
    { name: 'Rajesh Sharma', relationship: 'Father' },
    { name: 'Sunita Sharma', relationship: 'Mother' },
    { name: 'Arjun Sharma', relationship: 'Son' },
    { name: 'Priya Sharma', relationship: 'Daughter' },
    { name: 'Ramesh Sharma', relationship: 'Grandfather' },
  ];

  memberDefs.forEach((m) => familyStore.getState().addMember(m));

  const members = familyStore.getState().members;
  const dad = members[0];
  const mom = members[1];
  const son = members[2];
  const daughter = members[3];
  const grandpa = members[4];

  if (!dad || !mom || !son || !daughter || !grandpa) return;

  const health = healthStore.getState();
  const finance = financeStore.getState();
  const education = educationStore.getState();
  const documents = documentsStore.getState();
  const places = placesStore.getState();
  const permissions = permissionsStore.getState();

  health.updateProfile(dad.id, { bloodGroup: 'B+', allergies: 'None', conditions: 'Mild hypertension', emergencyNotes: 'Takes BP medication daily' });
  health.updateProfile(mom.id, { bloodGroup: 'O+', allergies: 'Penicillin', conditions: 'None', emergencyNotes: '' });
  health.updateProfile(son.id, { bloodGroup: 'B+', allergies: 'Peanuts', conditions: 'Asthma (mild)', emergencyNotes: 'Carries inhaler' });
  health.updateProfile(daughter.id, { bloodGroup: 'A+', allergies: 'None', conditions: 'None', emergencyNotes: '' });
  health.updateProfile(grandpa.id, { bloodGroup: 'O-', allergies: 'None', conditions: 'Diabetes, Arthritis', emergencyNotes: 'Insulin dependent, check sugar twice daily' });

  health.addMedication(dad.id, { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', prescribedBy: 'Dr. Mehta' });
  health.addMedication(grandpa.id, { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedBy: 'Dr. Kapoor' });
  health.addMedication(son.id, { name: 'Salbutamol Inhaler', dosage: '2 puffs', frequency: 'As needed', prescribedBy: 'Dr. Mehta' });

  const today = new Date();
  const inDays = (n) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

  health.addAppointment(grandpa.id, { doctor: 'Dr. Kapoor', hospital: 'City Hospital', date: inDays(3), time: '10:00', purpose: 'Diabetes checkup' });
  health.addAppointment(dad.id, { doctor: 'Dr. Mehta', hospital: 'Apollo Clinic', date: inDays(10), time: '17:30', purpose: 'BP review' });
  health.addAppointment(daughter.id, { doctor: 'Dr. Singh', hospital: 'City Hospital', date: inDays(20), time: '11:00', purpose: 'Annual checkup' });

  health.addEmergencyContact(dad.id, { name: 'Sunita Sharma', relation: 'Spouse', phone: '9876543210', priority: 1 });
  health.addEmergencyContact(dad.id, { name: 'Dr. Mehta', relation: 'Family Doctor', phone: '9123456780', priority: 2 });
  health.addEmergencyContact(grandpa.id, { name: 'Rajesh Sharma', relation: 'Son', phone: '9876543210', priority: 1 });

  health.addVaccination(son.id, { name: 'Tdap Booster', date: inDays(-200), nextDue: inDays(15) });
  health.addVaccination(daughter.id, { name: 'HPV Vaccine', date: inDays(-100), nextDue: inDays(60) });

  health.addMetric(grandpa.id, { type: 'Blood Sugar (mg/dL)', value: 145, date: inDays(-20) });
  health.addMetric(grandpa.id, { type: 'Blood Sugar (mg/dL)', value: 138, date: inDays(-10) });
  health.addMetric(grandpa.id, { type: 'Blood Sugar (mg/dL)', value: 130, date: inDays(-2) });
  health.addMetric(dad.id, { type: 'Weight (kg)', value: 78, date: inDays(-30) });
  health.addMetric(dad.id, { type: 'Weight (kg)', value: 77, date: inDays(-15) });
  health.addMetric(dad.id, { type: 'Weight (kg)', value: 76, date: inDays(-1) });

  finance.addIncome({ source: 'Salary', member: 'Rajesh Sharma', amount: 85000, frequency: 'Monthly' });
  finance.addIncome({ source: 'Freelancing', member: 'Sunita Sharma', amount: 20000, frequency: 'Monthly' });
  finance.addExpense({ category: 'Housing', member: 'Rajesh Sharma', amount: 25000, date: inDays(-5) });
  finance.addExpense({ category: 'Food', member: 'Sunita Sharma', amount: 12000, date: inDays(-3) });
  finance.addExpense({ category: 'Education', member: 'Rajesh Sharma', amount: 15000, date: inDays(-7) });
  finance.addExpense({ category: 'Healthcare', member: 'Rajesh Sharma', amount: 6000, date: inDays(-2) });
  finance.addExpense({ category: 'Transportation', member: 'Rajesh Sharma', amount: 8000, date: inDays(-1) });
  finance.setBudget(90000, { Food: 15000, Education: 18000, Healthcare: 8000, Transport: 10000 });
  finance.addAsset({ name: 'Family Home', type: 'Property', owner: 'Rajesh Sharma', value: 5500000 });
  finance.addAsset({ name: 'Honda City', type: 'Vehicle', owner: 'Rajesh Sharma', value: 900000 });
  finance.addLiability({ type: 'Home Loan', amount: 2500000, paid: 900000 });
  finance.addGoal({ name: 'Arjun College Fund', target: 500000, current: 210000, deadline: '2028' });

  education.updateProfile(son.id, { institution: 'Delhi Public School', course: '11th Grade - Science', year: '2025-26', rollNumber: 'DPS-1145' });
  education.updateProfile(daughter.id, { institution: 'St. Xavier College', course: 'B.Com', year: '2nd Year', rollNumber: 'SXC-2201' });
  education.addPerformance(son.id, { semester: 'Sem 1', percentage: 82 });
  education.addPerformance(son.id, { semester: 'Sem 2', percentage: 88 });
  education.addPerformance(daughter.id, { semester: 'Sem 1', percentage: 76 });
  education.addPerformance(daughter.id, { semester: 'Sem 2', percentage: 84 });
  education.addExam(son.id, { subject: 'Physics', date: inDays(6) });
  education.addExam(son.id, { subject: 'Chemistry', date: inDays(9) });
  education.addExam(daughter.id, { subject: 'Accountancy', date: inDays(14) });
  education.addCertificate(son.id, { title: 'National Science Olympiad', type: 'Competition', issuer: 'SOF', date: inDays(-90) });
  education.addSkill(son.id, { name: 'Python', level: 'Intermediate' });
  education.addSkill(daughter.id, { name: 'Excel', level: 'Advanced' });

  documents.addDocument({ name: 'Rajesh Aadhar Card', category: 'Identity', owner: 'Rajesh Sharma', expiryDate: '' });
  documents.addDocument({ name: 'Family Health Insurance', category: 'Insurance', owner: 'Rajesh Sharma', expiryDate: inDays(25) });
  documents.addDocument({ name: 'Car Insurance', category: 'Insurance', owner: 'Rajesh Sharma', expiryDate: inDays(45) });
  documents.addDocument({ name: 'Property Papers', category: 'Property', owner: 'Rajesh Sharma', expiryDate: '' });
  documents.addDocument({ name: 'Arjun Birth Certificate', category: 'Identity', owner: 'Arjun Sharma', expiryDate: '' });

  places.addPlace({ name: 'Home', type: 'Home', address: '42 MG Road, Delhi', notes: '' });
  places.addPlace({ name: 'City Hospital', type: 'Hospital', address: 'Sector 12, Delhi', notes: 'Family doctor here' });
  places.addPlace({ name: 'Delhi Public School', type: 'School', address: 'Sector 5, Delhi', notes: '' });

  permissions.setRole(dad.id, 'Family Owner');
  permissions.setRole(mom.id, 'Admin');
  permissions.setRole(son.id, 'Student');
  permissions.setRole(daughter.id, 'Adult Member');
  permissions.setRole(grandpa.id, 'Adult Member');
}
