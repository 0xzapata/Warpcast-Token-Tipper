import { expect } from 'chai';
import { tipRepliesUsingCsv } from '../tipRepliesUsingCsv.js';

describe('tipRepliesUsingCsv', function() {
  it('should throw an error if no file path is provided', async function() {
    try {
      await tipRepliesUsingCsv();
      throw new Error('Function did not throw');
    } catch (error) {
      expect(error.message).to.equal('File path is required');
    }
  });

  it('should return an array of receipts', async function() {
    const filePath = 'test.csv';
    const receipts = await tipRepliesUsingCsv(100, filePath);
    expect(receipts).to.be.an('array');
  });

  it('should throw an error if the amount sent is negative', async function() {
    const filePath = 'test.csv';
    const amount = -100; // negative amount
    try {
      await tipRepliesUsingCsv(amount, filePath);
      throw new Error('Function did not throw');
    } catch (error) {
      expect(error.message).to.equal('Not enough token balance to send');
    }
  });
  
  it('should throw an error if the amount sent is more than the signer\'s balance', async function() {
    const filePath = 'test.csv';
    const signerBalance = await tokenAddress.balance(baseClient.signer.address);
    const amount = signerBalance + 100; // amount more than signer's balance
    try {
      await tipRepliesUsingCsv(amount, filePath);
      throw new Error('Function did not throw');
    } catch (error) {
      expect(error.message).to.equal('Not enough token balance to send');
    }
  });
});