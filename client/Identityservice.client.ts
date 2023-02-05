/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { Addr, DaosResponse, ExecuteMsg, Duration, Decimal, DaoMembersInstantiateMsg, Member, IdType, GetIdentityByNameResponse, Identity, GetIdentityByOwnerResponse, InstantiateMsg, QueryMsg, Ordering } from "./Identityservice.types";
export interface IdentityserviceReadOnlyInterface {
  contractAddress: string;
  getIdentityByOwner: ({
    owner
  }: {
    owner: string;
  }) => Promise<GetIdentityByOwnerResponse>;
  getIdentityByName: ({
    name
  }: {
    name: string;
  }) => Promise<GetIdentityByNameResponse>;
  daos: ({
    limit,
    order,
    startAfter
  }: {
    limit?: number;
    order?: Ordering;
    startAfter?: number;
  }) => Promise<DaosResponse>;
}
export class IdentityserviceQueryClient implements IdentityserviceReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.getIdentityByOwner = this.getIdentityByOwner.bind(this);
    this.getIdentityByName = this.getIdentityByName.bind(this);
    this.daos = this.daos.bind(this);
  }

  getIdentityByOwner = async ({
    owner
  }: {
    owner: string;
  }): Promise<GetIdentityByOwnerResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_identity_by_owner: {
        owner
      }
    });
  };
  getIdentityByName = async ({
    name
  }: {
    name: string;
  }): Promise<GetIdentityByNameResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_identity_by_name: {
        name
      }
    });
  };
  daos = async ({
    limit,
    order,
    startAfter
  }: {
    limit?: number;
    order?: Ordering;
    startAfter?: number;
  }): Promise<DaosResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      daos: {
        limit,
        order,
        start_after: startAfter
      }
    });
  };
}
export interface IdentityserviceInterface extends IdentityserviceReadOnlyInterface {
  contractAddress: string;
  sender: string;
  registerUser: ({
    name
  }: {
    name: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  registerDao: ({
    daoName,
    maxVotingPeriod,
    members,
    thresholdPercentage
  }: {
    daoName: string;
    maxVotingPeriod: Duration;
    members: Member[];
    thresholdPercentage: Decimal;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class IdentityserviceClient extends IdentityserviceQueryClient implements IdentityserviceInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.registerUser = this.registerUser.bind(this);
    this.registerDao = this.registerDao.bind(this);
  }

  registerUser = async ({
    name
  }: {
    name: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register_user: {
        name
      }
    }, fee, memo, funds);
  };
  registerDao = async ({
    daoName,
    maxVotingPeriod,
    members,
    thresholdPercentage
  }: {
    daoName: string;
    maxVotingPeriod: Duration;
    members: Member[];
    thresholdPercentage: Decimal;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register_dao: {
        dao_name: daoName,
        max_voting_period: maxVotingPeriod,
        members,
        threshold_percentage: thresholdPercentage
      }
    }, fee, memo, funds);
  };
}