import { AccountType } from '../constants/account.type';
import { createTransactionDataType } from '../schemas/transaction.schema';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';
import { accountExists } from './account.service';

export async function validateTransaction(data: createTransactionDataType) {
  const { fromAccountId, toAccountId, amount } = data;

  // Checks if the source and destination accounts are the same
  if (fromAccountId === toAccountId)
    throw new ClientError(
      'Source and destination accounts must be different.',
      HttpStatusCodes.BAD_REQUEST
    );

  // Fetching both accounts in parallel for efficiency
  const [fromAccount, toAccount] = await Promise.all([
    accountExists(fromAccountId),
    accountExists(toAccountId),
  ]);

  // Checks if the source account exists
  if (!fromAccount)
    throw new ClientError('Invalid from account', HttpStatusCodes.NOT_FOUND, {
      fromAccountId: ['Account not found.'],
    });

  // Checks if target account exists
  if (!toAccount)
    throw new ClientError('Invalid to account', HttpStatusCodes.NOT_FOUND, {
      toAccountId: ['Account not found.'],
    });

  // Checks if the source account is a Merchant type
  if (AccountType[fromAccount.accountTypeId] === 'MERCHANT')
    throw new ClientError(
      'Transaction not allowed',
      HttpStatusCodes.FORBIDDEN,
      {
        fromAccountId: ['Merchant accounts cannot send money.'],
      }
    );

  // Checks if the source account has sufficient balance to complete the transaction
  if (Number(fromAccount.balance) < amount)
    throw new ClientError(
      'Insufficient funds for transaction',
      HttpStatusCodes.FORBIDDEN,
      {
        fromAccountId: [
          'The source account does not have enough balance to complete this transaction.',
        ],
      }
    );
}
