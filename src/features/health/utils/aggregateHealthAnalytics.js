export function buildHealthOverview(members, healthData) {
  let profilesComplete = 0;
  let totalAppointments = 0;
  let totalMedications = 0;
  let vaccinationsDue = 0;
  let emergencyContactsSet = 0;

  const today = new Date(new Date().toDateString());

  const perMember = members.map((m) => {
    const data = healthData[m.id] || {};
    const profile = data.profile || {};
    const appointments = data.appointments || [];
    const medications = data.medications || [];
    const vaccinations = data.vaccinations || [];
    const emergencyContacts = data.emergencyContacts || [];

    if (profile.bloodGroup) profilesComplete++;
    if (emergencyContacts.length > 0) emergencyContactsSet++;

    const upcomingAppointments = appointments.filter((a) => a.date && new Date(a.date) >= today);
    totalAppointments += upcomingAppointments.length;
    totalMedications += medications.length;

    const dueVaccinations = vaccinations.filter((v) => {
      if (!v.nextDue) return false;
      const diff = Math.round((new Date(v.nextDue) - today) / 86400000);
      return diff >= 0 && diff <= 30;
    });
    vaccinationsDue += dueVaccinations.length;

    return {
      member: m,
      profile,
      appointmentsCount: upcomingAppointments.length,
      medicationsCount: medications.length,
      vaccinationsDueCount: dueVaccinations.length,
      hasEmergencyContact: emergencyContacts.length > 0,
    };
  });

  return {
    profilesComplete,
    totalAppointments,
    totalMedications,
    vaccinationsDue,
    emergencyContactsSet,
    perMember,
  };
}
