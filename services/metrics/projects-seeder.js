import { connectDB } from "../../datatabase/db.js";
import { Projects } from "../../models/Jira/projects.js";

export class ProjectsSeeder {
   
    async seed() {
        await connectDB();
        await Projects.insertMany([
            {
                key: 'ACN',
                name: 'ACTO Innovation',
                core: false,
                boardId: [175]
            },
            {
                key: 'ADD',
                name: 'ACTO Design',
                core: false,
                boardId: [180],
            }, 
            {
                key: 'AUTO',
                name: 'ACTO Automation',
                core: false,
                boardId: [192],
            },
            {
                key: 'PAA',
                name: 'Team Die Hard',
                core: true,
                boardId: [178],
            },
            {
                key: 'POS',
                name: 'Professional Services',
                core: false,
                boardId: [195]
            },
            {
                key: 'QS',
                name: 'QA Source',
                core: false,
                boardId: [131]
            },
            {
                key: 'TBP',
                name: 'Team Beatles',
                core: true,
                boardId: [167]
            },
            {
                key: 'TEP',
                name: 'Team Enablers',
                core: true,
                boardId: [170]
            },
            {
                key: 'TMP',
                name: 'Team MVP',
                core: true,
                boardId: [168]
            },
            {
                key: 'UXUI',
                name: 'UX/UI',
                core: true,
                boardId: [181]
            }
        ])
    }
}