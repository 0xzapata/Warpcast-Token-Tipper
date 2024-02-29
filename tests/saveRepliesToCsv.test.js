import { expect } from 'chai';
import { saveRepliesToCsv } from '../saveRepliesToCsv.js';

describe('saveRepliesToCsv', function() {
  it('should throw an error if no URL is provided', async function() {
    try {
      await saveRepliesToCsv();
      throw new Error('Function did not throw');
    } catch (error) {
      expect(error.message).to.equal('URL is required');
    }
  });

  it('should return an array of replies', async function() {
    const url = 'https://warpcast.com/dwr.eth/0x6299d85e';
    const replies = await saveRepliesToCsv(url);
    expect(replies).to.be.an('array');
  });

});