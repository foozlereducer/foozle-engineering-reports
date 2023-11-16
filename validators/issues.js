import { issuesSchema } from "../models/issues.js";
import { PropsValidator } from "./PropsValidator.js";

export class IssueValidation {
    constructor() {
        this.switch = false;
        this.undefined = {}
        this.length = {};
    }

    generatePropValidator(val = false, propName = '') {
        return new PropsValidator(val, propName)
    }
   
    undefinedOrEmpty(flag = false, val = false,  ) {
        this.undefined = {
            switch: flag,
            val: val,
            error: '`storyPoints` is undefined and is required'
        }
    }
    
    zeroLength(flag = false, val = 0) {
        this.length = {
            switch: flag,
            val: val,
            error: this.wrongValue(this.length.val)
        };
    }
    accepted(flag = false, val = 0) {
        this.accepted = {
            undefined: {
                switch: flag,
                val: val,
                error: '`storyPoints.accepted` is undefined and is required'
            },
            length: {
                switch: false,
                val: 0,
                error:   this.wrongValue(this.length.val, "storyPoints.accepted.length")
            },
            value: {
                switch: false,
                val: 0,
                error:  this.wrongValue(this.value.val, "storyPoints.accepted")
            }
        };
    }
}
    //     this.committed = {
    //         undefined: {
    //             switch: false,
    //             val: true,
    //             error: '`storyPoints.committed` is undefined and is required'
    //         },
    //         length: {
    //             switch: false,
    //             val: 0,
    //             error:   this.wrongValue(this.committed.length.val, "storyPoints.committed.length")
    //         },
    //         value: {
    //             switch: false,
    //             val: 0,
    //             error:  this.wrongValue(this.committed.value.val, "storyPoints.committed")
    //         }
    //     };

    //     completed = {
    //         undefined: {
    //             switch: false,
    //             val: true,
    //             error: '`storyPoints.completed` is undefined and is required'
    //         },
    //         length: {
    //             switch: false,
    //             val: 0,
    //             error:   this.wrongValue(this.completed.length.val, "storyPoints.completed.length")
    //         },
    //         value: {
    //             switch: false,
    //             val: 0,
    //             error:  this.wrongValue(this.completed.value.val, "storyPoints.completed")
    //         }
    //     };
    //     this.estimated = {
    //         undefined: {
    //             switch: false,
    //             val: true,
    //             error: '`storyPoints.estimated` is undefined and is required'
    //         },
    //         length: {
    //             switch: false,
    //             val: 0,
    //             error:   this.wrongValue(this.estimated.length.val, "storyPoints.estimated.length")
    //         },
    //         value: {
    //             switch: false,
    //             val: 0,
    //             error:  this.wrongValue(this.estimated.value.val, "storyPoints.estimated")
    //         }
    //     }

    //     this.actual = {
    //         undefined: {
    //             switch: false,
    //             val: true,
    //             error: '`storyPoints.actual` is undefined and is required'
    //         },
    //         length: {
    //             switch: false,
    //             val: 0,
    //             error:   this.wrongValue(this.actual.length.val, "storyPoints.actual.length")
    //         },
    //         value: {
    //             switch: false,
    //             val: 0,
    //             error:  this.wrongValue(this.actual.value.val, "storyPoints.actual")
    //         }
    //     }

    // }
    // issuesSchema.path('teamRoles').validate(function(teamRoles){
    //     if(!teamRoles){return false}
    //     else if(teamRoles.length === 0){return false}
    //     return true;
    // }, '`teamRoles` is required');
//     issuesSchema.path('storyPoints').validate(function(storyPoints){
//         let error = '';
//         if(!storyPoints){
//             storyPointsObj.undefined.val = true;
//             storyPointsObj.undefined.switch = true;
//             error += storyPointsObj.undefined.error;
//             storyPointsObj.switch = true;
//         }
//         else if(storyPoints.length === 0){
//             storyPointsObj.length.val = 0;
//             storyPointsObj.length.switch = true;
//             error += ' ' + storyPointsObj.length.error;
//             storyPointsObj.switch = true;
//         } 
//         else if(!storyPoints.accepted) {
//             storyPointsObj.accepted.length.val = 0;
//             storyPointsObj.accepted.length.switch = true;
//             error += ' ' + storyPointsObj.accepted.length.error;
//             storyPointsObj.switch = true;
//         }
//         else if(!storyPoints.committed) {
//             storyPointsObj.committed.length.val = 0;
//             storyPointsObj.committed.length.switch = true;
//             error += ' ' + storyPointsObj.committed.length.error;
//             storyPointsObj.switch = true;
//         }
//         else if(!storyPoints.completed) {
//             storyPointsObj.completed.length.val = 0;
//             storyPointsObj.completed.length.switch = true;
//             error += ' ' + storyPointsObj.completed.length.error;
//             storyPointsObj.switch = true;
//         }
//         else if(!storyPoints.estimated) {
//             storyPointsObj.estimated.length.val = 0;
//             storyPointsObj.estimated.length.switch = true;
//             error += ' ' + storyPointsObj.estimated.length.error;
//             storyPointsObj.switch = true;
//         }
//         else if(!storyPoints.actual) {
//             storyPointsObj.actual.length.val = 0;
//             storyPointsObj.actual.length.switch = true;
//             error += ' ' + storyPointsObj.actual.length.error;
//             storyPointsObj.switch = true;
//         }

//         return (storyPointsObj.switch === true) ? false : true;
        
//     }, errors);
// }