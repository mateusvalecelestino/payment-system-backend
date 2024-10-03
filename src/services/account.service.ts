import { prisma } from '../lib/prisma.lib';
import ClientError from '../utils/client-error.util';
import HttpStatusCodes from '../utils/http-status-codes.util';

export async function checkAccountTypeExistence(id: number) {
  const accountType = await prisma.accountType.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!accountType)
    throw new ClientError('invalid accountTypeId', HttpStatusCodes.NOT_FOUND, {
      account: {
        accountTypeId: ["don't exists"],
      },
    });
}
