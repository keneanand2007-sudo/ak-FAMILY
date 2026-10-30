var DEFAULT_MATRIX = {
  'Family Owner': { view: true, edit: true },
  'Admin': { view: true, edit: true },
  'Adult Member': { view: true, edit: true },
  'Student': { view: true, edit: false },
  'Child': { view: true, edit: false },
  'Emergency Contact': { view: false, edit: false },
  'Viewer': { view: true, edit: false },
};

export function canEdit(role, category) {
  var perm = DEFAULT_MATRIX[role];
  if (!perm) return false;
  return perm.edit === true;
}

export function canView(role, category) {
  var perm = DEFAULT_MATRIX[role];
  if (!perm) return false;
  return perm.view === true;
}

export function getPermissionMatrix() {
  return DEFAULT_MATRIX;
}

export function buildPermissionInsights(members, roles, auditLog) {
  var insights = [];

  var noRoleMembers = members.filter(function (m) { return !roles[m.id]; });
  if (noRoleMembers.length > 0) {
    insights.push({
      id: 'perm-norole',
      severity: 'important',
      text: noRoleMembers.length + ' member(s) have no role assigned and default to Viewer access.',
    });
  }

  var ownerCount = members.filter(function (m) { return roles[m.id] === 'Family Owner'; }).length;
  if (ownerCount === 0 && members.length > 0) {
    insights.push({
      id: 'perm-noowner',
      severity: 'critical',
      text: 'No Family Owner is assigned. Assign one member as Owner for full administrative control.',
    });
  }
  if (ownerCount > 1) {
    insights.push({
      id: 'perm-multiowner',
      severity: 'important',
      text: ownerCount + ' members are set as Family Owner. Consider having a single primary owner.',
    });
  }

  var recentActions = auditLog.slice(0, 20);
  var actorCounts = {};
  recentActions.forEach(function (log) {
    actorCounts[log.actor] = (actorCounts[log.actor] || 0) + 1;
  });
  Object.keys(actorCounts).forEach(function (actor) {
    if (actorCounts[actor] >= 5) {
      insights.push({
        id: 'perm-active-' + actor,
        severity: 'good',
        text: actor + ' has been actively managing permissions (' + actorCounts[actor] + ' recent changes).',
      });
    }
  });

  return insights;
}
