const core = require('@actions/core');
const github = require('@actions/github');

const { App } = require("@slack/bolt");

// Post a message to a channel your app is in using ID and message text
async function publishMessage(app, id, text, token) {
    try {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await app.client.chat.postMessage({
        // The token you used to initialize your app
        token: token,
        channel: id,
        text: text
        // You could also use a blocks[] array to send richer content
      });
  
      // Print result, which includes information about the message (like TS)
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }

try {
  // `who-to-greet` input defined in action metadata file
  const slackToken = core.getInput('slack-token');
  const slackSecret = core.getInput('slack-secret');
  const slackChannelId = core.getInput('slack-channel-id');

  console.log("context", JSON.stringify(github.context));
  
  
  const commitMessage = "Test Message"; //github.context.payload.commits[0].message;


  const app = new App({
    token: slackToken,
    signingSecret: slackSecret,
  });

  (async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    // console.log("⚡️ Bolt app is running!");
    
    // After the app starts, publish message
    await publishMessage(
        app,
        slackChannelId, 
        `Received a ${github.context.eventName} event with the following commit message:\n
        ${commitMessage}.
        \n\nThis discussion was classified as: ${["Design Discussion", "Non-Design Discussion"][Math.floor(Math.random() * 2)]}`,
        slackToken
    );

    await app.stop();
  })();


//   console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}