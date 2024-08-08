/** Types generated for queries found in "src/app/api/blocks/route.ts" */

/** 'GetBlocksByDesc' parameters type */
export interface IGetBlocksByDescParams {
  pageOffset: bigint | number;
  queryLimit: bigint | number;
}

/** 'GetBlocksByDesc' return type */
export interface IGetBlocksByDescResult {
  created_at: Date;
  height: bigint;
}

/** 'GetBlocksByDesc' query type */
export interface IGetBlocksByDescQuery {
  params: IGetBlocksByDescParams;
  result: IGetBlocksByDescResult;
}

/** 'GetBlocksCount' parameters type */
export type IGetBlocksCountParams = void;

/** 'GetBlocksCount' return type */
export interface IGetBlocksCountResult {
  count: number;
}

/** 'GetBlocksCount' query type */
export interface IGetBlocksCountQuery {
  params: IGetBlocksCountParams;
  result: IGetBlocksCountResult;
}

