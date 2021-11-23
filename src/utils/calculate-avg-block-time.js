const BLOCK_PER_SEC = 13.2;
/**
 *
 * @param {number} days - time in days
 */
export const daysToBlock = (days) => {
  return Math.ceil((days * 24 * 60 * 60) / BLOCK_PER_SEC);
};

/**
 *
 * @param {number} blocks  - number of blocks
 */
export const blocksToDays = (blocks) => {
  return Math.floor((blocks * BLOCK_PER_SEC) / (24 * 60 * 60));
};
