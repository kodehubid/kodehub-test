'use strict';

import DataLoader from 'dataloader';
import { batchUserMessage } from '../user/dataloader';

export default function allDataLoader(models) {
  return {
    userMessage: new DataLoader(keys => batchUserMessage(keys, models))
  };
}
