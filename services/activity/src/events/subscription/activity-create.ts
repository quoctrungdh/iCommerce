import logger from '../../helpers/logger';
import ActivityModel from '../../models/activity.model';

export const ACTIVITY_SERVICE_CREATE = 'ACTIVITY_SERVICE_CREATE';

function subscriptionActivityCreate(nc: any) {
  nc.subscribe(ACTIVITY_SERVICE_CREATE, async (err: any, msg: any) => {
    if (err) {
      logger.error(err);
    } else {
      try {
        logger.info(
          `${ACTIVITY_SERVICE_CREATE}: message received on: ${new Date().toDateString()}`,
          msg.subject,
          JSON.stringify(msg.data)
        );
        await ActivityModel.create({
          ...msg.data,
          data: JSON.stringify(msg.data.data),
        });
      } catch (error) {
        logger.debug(error);
      }
    }
  });
}

export default subscriptionActivityCreate;
