'use strict';

import DataLoader from 'dataloader';
import { batchUserMessage } from './message';

export default function allDataLoader(models) {
  return {
    userMessage: new DataLoader(keys => batchUserMessage(keys, models))
  };
}
