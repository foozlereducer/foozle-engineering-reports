import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import stripAnsi from 'strip-ansi';
import { log } from '../controllers/logController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the color map based on log levels
const customColors = {
  emerg: 'red',
  alert: 'orange',
  crit: 'darkred',
  error: 'red',
  warn: 'yellow',
  notice: 'cyan',
  info: 'green',
  debug: 'blue',
};

// Regex to match timestamp, log level, and message
const logRegex = /^(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) \[(?<level>[a-z]+)\]: (?<message>.*)$/;

router.get('/api/logs/:date', (req, res) => {
  const date = req.params.date; // expected in the format YYYY-MM-DD
  const logFilePath = path.join(__dirname, '..', 'logs', `application-${date}.log`);

  // Get query parameters for pagination
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send({ error: 'Log file not found' });
      return;
    }

    // Split log data and parse it into an array of objects
    const allLogEntries = data.split('\n')
      .filter(entry => entry.trim() !== '') // Remove empty lines
      .map((entry, index) => {
        // Step 1: Strip ANSI codes
        const cleanedEntry = stripAnsi(entry);

        // Step 2: Match the cleaned entry with the regex
        const match = cleanedEntry.match(logRegex);
        if (match && match.groups) {
          const { timestamp, level, message } = match.groups;

          // Assign color based on level
          const color = customColors[level] || 'black';
          console.log(color)

          return {
            id: `${date}-${index}`, // Generate a unique ID
            timestamp,
            level,
            message,
            color,
          };
        } else {
          // For non-matching lines, treat as a plain log line
          return { message: cleanedEntry, color: 'black' };
        }
      });

    // Calculate total pages and current page's entries for pagination
    const totalEntries = allLogEntries.length;
    const totalPages = Math.ceil(totalEntries / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalEntries);
    const currentEntries = allLogEntries.slice(startIndex, endIndex);

    // Respond with current page's log entries and pagination metadata
    res.json({
      data: currentEntries,
      currentPage: page,
      totalPages: totalPages,
      totalEntries: totalEntries,
    });
  });
});

/**
 * Route for external services (Vue3 frontend) 
 * The service must post an object with status, message, severity, error 
 */
router.post("/v1/api/log", log);

export { router as logRouter };
