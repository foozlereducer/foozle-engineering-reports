import test from "ava";
import { effortPerformanceIndex } from "../../../models/effortPerformanceIndex.js";
import { connectDB } from "../../../datatabase/db.js";

test('effortPerformanceIndex schema validates and transforms data', async (t) => {
    // Create an instance of the Mongoose model
    const EffortPerformanceIndex = effortPerformanceIndex;
  
    // Try to create an instance with invalid data
    const invalidData = { plannedEffortStoryPoints: 'invalid', completedStoryPoints: 5, sprint: {} };
    try {
      await EffortPerformanceIndex.create(invalidData);
      t.fail('Should have thrown a validation error');
    } catch (error) {
      t.is(error.name, 'ValidationError');
    }
    
    const startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 14)

    // Create an instance with valid data
    const validData = { 
        plannedEffortStoryPoints: 10, 
        completedStoryPoints: 5, 
        sprint: {
            name: 'Platform Insights',
            goal: 'To have meaningul platform insights for our clients managers',
            startDate: startDate,
            endDate: endDate
        } 
    };
    connectDB();
    const result = await EffortPerformanceIndex.create(validData);
    t.is(result.plannedEffortStoryPoints, 10);
    t.is(result.completedStoryPoints, 5);
    t.is(result.sprint.name, 'Platform Insights');
    t.is(result.sprint.goal, 'To have meaningul platform insights for our clients managers')
    t.is(result.sprint.endDate, endDate);
    t.is(result.sprint.startDate, startDate)
  });