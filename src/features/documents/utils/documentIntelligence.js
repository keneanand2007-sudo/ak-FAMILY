var ESSENTIAL_DOCS = [
  { category: 'Identity', label: 'Identity Proof (Aadhar/Passport)' },
  { category: 'Insurance', label: 'Health Insurance' },
  { category: 'Property', label: 'Property Papers' },
  { category: 'Financial', label: 'Bank/Financial Records' },
];

export function buildMissingDocSuggestions(documents) {
  var presentCategories = {};
  documents.forEach(function (d) {
    presentCategories[d.category] = true;
  });

  return ESSENTIAL_DOCS.filter(function (essential) {
    return !presentCategories[essential.category];
  });
}
