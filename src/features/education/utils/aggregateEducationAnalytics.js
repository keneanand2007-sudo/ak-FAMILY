export function buildEducationOverview(members, educationData) {
  const perMember = members.map((m) => {
    const data = educationData[m.id] || {};
    const profile = data.profile || {};
    const performance = data.performance || [];
    const exams = data.exams || [];
    const certificates = data.certificates || [];
    const skills = data.skills || [];

    const latestPerf = performance.length > 0 ? Number(performance[performance.length - 1].percentage) : null;

    return {
      member: m,
      isStudent: !!profile.institution,
      institution: profile.institution || '',
      latestPerformance: latestPerf,
      examsCount: exams.length,
      certificatesCount: certificates.length,
      skillsCount: skills.length,
      performance,
    };
  });

  const students = perMember.filter((p) => p.isStudent);
  const totalExams = perMember.reduce((sum, p) => sum + p.examsCount, 0);
  const totalCertificates = perMember.reduce((sum, p) => sum + p.certificatesCount, 0);

  return {
    students,
    totalStudents: students.length,
    totalExams,
    totalCertificates,
    perMember,
  };
}
