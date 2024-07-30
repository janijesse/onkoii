const { Client } = require('@notionhq/client');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const task = require('./task');

// Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

class CoreLogic {
  async task(round) {
    const notionData = await this.checkNotionContent();
    
    if (!notionData || notionData.length === 0) {
      console.error('No content found in Notion');
      return null;
    }

    const result = await task.submission.task(round);
    return result;
  }

  async submitTask(round) {
    const submission = await task.submission.submitTask(round);
    return submission;
  }

  async auditTask(round) {
    await task.audit.auditTask(round);
  }

  async selectAndGenerateDistributionList(
    round,
    isPreviousRoundFailed = false,
  ) {
    await namespaceWrapper.selectAndGenerateDistributionList(
      task.distribution.submitDistributionList,
      round,
      isPreviousRoundFailed,
    );
  }

  async auditDistribution(round) {
    await task.distribution.auditDistribution(round);
  }

  async checkNotionContent() {
    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 10,
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching data from Notion:', error);
      return null;
    }
  }
}

const coreLogic = new CoreLogic();

module.exports = { coreLogic };
