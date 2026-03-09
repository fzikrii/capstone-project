import Task from "../models/tasks.model.js";
import User from "../models/users.model.js";

const getTaskScore = (task) => {
  if (!task || task.status !== "Done") return 0;

  let score = 30;

  if (task.completedAt && task.deadline) {
    const completedAt = new Date(task.completedAt);
    const deadline = new Date(task.deadline);
    const msDiff = deadline.getTime() - completedAt.getTime();

    if (msDiff >= 0) {
      const hoursEarly = msDiff / (1000 * 60 * 60);
      score += Math.min(60, Math.floor(hoursEarly / 6) * 4 + 10);
    } else {
      const hoursLate = Math.abs(msDiff) / (1000 * 60 * 60);
      score += Math.max(5, 20 - Math.floor(hoursLate / 12) * 2);
    }
  } else {
    score += 15;
  }

  return score;
};

const getHighlightTitle = (points) => {
  if (points >= 800) return "Mythic Closer";
  if (points >= 550) return "Velocity Champion";
  if (points >= 350) return "Bounty Vanguard";
  if (points >= 200) return "Task Hunter";
  if (points >= 100) return "Fast Finisher";
  return "Rising Contributor";
};

export const recomputeAndPersistBountyRewards = async (userId) => {
  const [allAssignedTasks, completedTasks] = await Promise.all([
    Task.find({ assignedTo: userId }).select("_id"),
    Task.find({ assignedTo: userId, status: "Done" }).select(
      "status completedAt deadline"
    ),
  ]);

  const taskPoints = completedTasks.reduce((acc, task) => acc + getTaskScore(task), 0);
  const volumeBonus = Math.floor(completedTasks.length / 3) * 25;
  const totalPoints = taskPoints + volumeBonus;
  const highlightTitle = getHighlightTitle(totalPoints);

  await User.findByIdAndUpdate(userId, {
    bountyPoints: totalPoints,
    bountyTitle: highlightTitle,
    bountyCompletedCount: completedTasks.length,
  });

  return {
    doneCount: completedTasks.length,
    totalAssigned: allAssignedTasks.length,
    taskPoints,
    volumeBonus,
    totalPoints,
    highlightTitle,
  };
};
