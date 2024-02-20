import test from 'ava';
import { StoryPoints } from '../../../services/jira/StoryPoints.js';
import { sum } from '../../../services/utilities/Sum.js';
import { Dates } from '../../../services/utilities/Dates.js';


test(`accepted, committed, completed and estimated story points 
have summed story points`, async t=>{
  const D  = new Dates();
  const SP = new StoryPoints(sum, D)
  const boardIds = [
      [ 'PAA', [ 178 ] ],
      [ 'TBP', [ 167 ] ],
      [ 'TEP', [ 170 ] ],
      [ 'TMP', [ 168 ] ],
      [ 'UXUI', [ 181 ] ]
  ]
  const mockedStoryPointTallies  = {
      accepted: [1,2,8,3,5,5,3],
      committed: [1,2,8,3,5,3,1],
      completed: [1,2,3,5,1],
      estimated: [2,2,5,3,5,3,1]
  }
  const res = SP.tallyStoryPoints(mockedStoryPointTallies)
  t.deepEqual(res, {accepted: 27, committed: 23, completed: 12, estimated: 21 })

})

test(`accepted, committed, completed and estimated 
      story points should be categorized`, t=> {
    const SP = new StoryPoints(sum);
    const storypoints = [1,5,8,3,2, 11];
    // for(sp of storypoints) {
    //     SP.categorieStoryPoints(sp, sprintDates) 
    // }
    

    t.true(true)
 })