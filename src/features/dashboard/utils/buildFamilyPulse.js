import { buildAlerts } from '../../alerts/utils/aggregateAlerts';

export function buildFamilyPulse(members, healthData, educationData, documents) {
  const alerts = buildAlerts(members, healthData, educationData, documents);

  let critical = 0;
  let important = 0;
  let upcoming = 0;

  alerts.forEach((a) => {
    if (a.daysLeft <= 2) critical++;
    else if (a.daysLeft <= 7) important++;
    else upcoming++;
  });

  return {
    total: alerts.length,
    critical,
    important,
    upcoming,
    alerts,
  };
}
