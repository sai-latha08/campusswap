/**
 * Calculates a rule-based match score (0 - 100%) between a learner and a teacher.
 * 
 * Weights:
 * - Skill compatibility = 40% (Teacher offers skill learner wants; Bonus if learner can teach what teacher wants)
 * - Experience = 20% (Years of experience in the skill: 0yr = 5%, 1yr = 12%, 2yr = 16%, 3+yr = 20%)
 * - Availability = 15% (Shared available days of week)
 * - Rating / Trust = 15% (Teacher trust score and average rating)
 * - Same College / Location = 10% (Same college = +7%, same campus location = +3%)
 */
function calculateSkillMatch(learner, teacher, requestedSkillId) {
  let score = 0;

  if (!learner || !teacher) return 50;

  // 1. Skill Compatibility (Max 40%)
  // Baseline: teacher has the requested skill
  const teacherHasSkill = teacher.skillsToTeach?.some(
    (item) => String(item.skill?._id || item.skill) === String(requestedSkillId)
  );

  if (teacherHasSkill) {
    score += 30;
  }

  // Barter / Mutual Skill Exchange Bonus: does teacher want any skill the learner can teach?
  const teacherWants = (teacher.skillsToLearn || []).map((s) => String(s._id || s));
  const learnerTeaches = (learner.skillsToTeach || []).map((item) => String(item.skill?._id || item.skill));
  const hasMutualSkill = learnerTeaches.some((skillId) => teacherWants.includes(skillId));

  if (hasMutualSkill) {
    score += 10; // Perfect 40%
  } else {
    // If learner wants this skill explicitly
    const learnerWants = (learner.skillsToLearn || []).map((s) => String(s._id || s));
    if (learnerWants.includes(String(requestedSkillId))) {
      score += 5;
    }
  }

  // 2. Teacher Experience (Max 20%)
  const skillEntry = (teacher.skillsToTeach || []).find(
    (item) => String(item.skill?._id || item.skill) === String(requestedSkillId)
  );
  const years = skillEntry?.experienceYears || 0;
  if (years >= 3) {
    score += 20;
  } else if (years === 2) {
    score += 16;
  } else if (years === 1) {
    score += 12;
  } else {
    score += 8;
  }

  // 3. Availability Compatibility (Max 15%)
  const learnerDays = (learner.availability || []).map((a) => a.day);
  const teacherDays = (teacher.availability || []).map((a) => a.day);

  if (learnerDays.length > 0 && teacherDays.length > 0) {
    const commonDays = learnerDays.filter((d) => teacherDays.includes(d));
    if (commonDays.length >= 2) {
      score += 15;
    } else if (commonDays.length === 1) {
      score += 10;
    } else {
      score += 5;
    }
  } else {
    score += 10; // Neutral default if either has not filled availability
  }

  // 4. Rating & Trust Score (Max 15%)
  const trustScore = teacher.trustScore || 50;
  const ratingWeight = Math.min(15, Math.round((trustScore / 100) * 15));
  score += ratingWeight;

  // 5. Same College & Location (Max 10%)
  if (learner.college && teacher.college && learner.college.toLowerCase() === teacher.college.toLowerCase()) {
    score += 7;
  }
  if (learner.location && teacher.location && learner.location.toLowerCase() === teacher.location.toLowerCase()) {
    score += 3;
  }

  // Cap score between 35% and 99%
  return Math.min(99, Math.max(35, Math.round(score)));
}

module.exports = { calculateSkillMatch };
