const { store, newId } = require('../models/store');

const assessmentService = {
  createAssessment({
    companyId = null,
    title,
    description = '',
    tasks = [],
    revealThreshold = 70,
    techStack = [],
    mentorStrictness = 5,
  }) {
    const id = newId();

    const assessment = {
      id,
      companyId,
      title,
      description,
      tasks,
      revealThreshold,
      techStack,
      mentorStrictness,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.assessments.set(id, assessment);
    return assessment;
  },

  listAssessments() {
    return Array.from(store.assessments.values());
  },

  getAssessmentById(id) {
    return store.assessments.get(id) || null;
  },
};

module.exports = { assessmentService };
