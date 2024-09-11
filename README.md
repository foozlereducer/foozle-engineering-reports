# acto-engineering-reports
This Vue3, node.js, express and mongoose project will take metrics from Jira or potentially any system and then display ISO2 reports of this data.

<h2>Start the app</h2>
<p>
Currently there is a start order:
<ol>
    <li>
        You start the backend first: <code>npm run devStart</code>. This will start the Node.js app with NodeMan
    </li>
    <li>
        You start the frontend second, cd the directory to <code> cd /views/frontend</code> and then run <code>npm run dev</code>. This will boot the Vue3 frontend app.
    </li>
</p>

<h2>Run the tests</h2>

<ol>
    <li>Ensure that the backend .env the <code>NODE_ENV="test"</code></li>
    <li>Run <code>npm run test</code>. This will run AVA tests. Every time you make a code change the tests will rerun</li>
</ol>