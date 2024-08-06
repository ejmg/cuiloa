/** Types generated for queries found in "src/app/api/ibc/clients/route.ts" */

/** 'GetClients' parameters type */
export interface IGetClientsParams {
  pageLimit: bigint | number;
  pageOffset: bigint | number;
}

/** 'GetClients' return type */
export interface IGetClientsResult {
  block_id: bigint;
  client_id: string;
  consensus_height: string | null;
  last_updated_at: Date;
}

/** 'GetClients' query type */
export interface IGetClientsQuery {
  params: IGetClientsParams;
  result: IGetClientsResult;
}

/** 'GetClientsCount' parameters type */
export type IGetClientsCountParams = void;

/** 'GetClientsCount' return type */
export interface IGetClientsCountResult {
  count: number;
}

/** 'GetClientsCount' query type */
export interface IGetClientsCountQuery {
  params: IGetClientsCountParams;
  result: IGetClientsCountResult;
}

