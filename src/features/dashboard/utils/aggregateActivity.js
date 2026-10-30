function extractTimestamp(id) {
  const parts = id.split('-');
  const last = parts[parts.length - 1];
  const num = Number(last);
  return isNaN(num) ? 0 : num;
}

export function buildRecentActivity(data) {
  const items = [];
  const members = data.members || [];

  function memberName(memberId) {
    const m = members.find((mm) => mm.id === memberId);
    return m ? m.name : 'A member';
  }

  members.forEach((m) => {
    items.push({
      id: 'act-' + m.id,
      text: m.name + ' was added to the family',
      timestamp: extractTimestamp(m.id),
      color: 'blue',
    });
  });

  Object.keys(data.healthData || {}).forEach((memberId) => {
    const h = data.healthData[memberId];
    (h.records || []).forEach((r) => {
      items.push({ id: 'act-' + r.id, text: memberName(memberId) + ' added a medical record: ' + r.type, timestamp: extractTimestamp(r.id), color: 'rose' });
    });
    (h.medications || []).forEach((med) => {
      items.push({ id: 'act-' + med.id, text: memberName(memberId) + ' added medication: ' + med.name, timestamp: extractTimestamp(med.id), color: 'rose' });
    });
    (h.appointments || []).forEach((a) => {
      items.push({ id: 'act-' + a.id, text: memberName(memberId) + ' scheduled an appointment with ' + a.doctor, timestamp: extractTimestamp(a.id), color: 'rose' });
    });
  });

  Object.keys(data.educationData || {}).forEach((memberId) => {
    const e = data.educationData[memberId];
    (e.exams || []).forEach((ex) => {
      items.push({ id: 'act-' + ex.id, text: memberName(memberId) + ' added an exam: ' + ex.subject, timestamp: extractTimestamp(ex.id), color: 'amber' });
    });
    (e.certificates || []).forEach((c) => {
      items.push({ id: 'act-' + c.id, text: memberName(memberId) + ' added a certificate: ' + c.title, timestamp: extractTimestamp(c.id), color: 'amber' });
    });
  });

  (data.income || []).forEach((i) => {
    items.push({ id: 'act-' + i.id, text: 'Income added: ' + i.source, timestamp: extractTimestamp(i.id), color: 'emerald' });
  });
  (data.expenses || []).forEach((e) => {
    items.push({ id: 'act-' + e.id, text: 'Expense added: ' + e.category, timestamp: extractTimestamp(e.id), color: 'emerald' });
  });
  (data.goals || []).forEach((g) => {
    items.push({ id: 'act-' + g.id, text: 'Financial goal added: ' + g.name, timestamp: extractTimestamp(g.id), color: 'emerald' });
  });

  (data.documents || []).forEach((d) => {
    items.push({ id: 'act-' + d.id, text: 'Document added: ' + d.name, timestamp: extractTimestamp(d.id), color: 'sky' });
  });

  (data.places || []).forEach((p) => {
    items.push({ id: 'act-' + p.id, text: 'Place added: ' + p.name, timestamp: extractTimestamp(p.id), color: 'violet' });
  });

  items.sort((a, b) => b.timestamp - a.timestamp);
  return items.slice(0, 8);
}
