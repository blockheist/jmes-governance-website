import { GovernanceQueryClient } from '../../client/Governance.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useAppState } from '../../contexts/AppStateContext';
import { useCoinSupplyContext } from '../../contexts/CoinSupply';
import { getProposalTypeForGovPublicProposals } from '../../utils/proposalUti';
import { ProposalResponse } from '../../client/Governance.types';
import { useGovernanceProposals } from './useGovernance';
import GovernanceProposalComponent from './GovernanceProposalComponent';
import { useMemo, useState } from 'react';
import GovHeader from './GovHeader';
import {
  Flex,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

const NEXT_PUBLIC_GOVERNANCE_CONTRACT = process.env
  .NEXT_PUBLIC_GOVERNANCE_CONTRACT as string;
type Props = {
  cosmWasmClient: CosmWasmClient;
  setSelectedProposalId: (id: number) => void;
};

// ORDER OF PROPOSAL TYPES
const proposalTypeOrder = {
  improvement: 1,
  revoke_proposal: 2,
  core_slot: 3,
  text: 4,
  feature_request: 5,
};
const sortProposalsByType = (a: ProposalResponse, b: ProposalResponse) => {
  const aType = getProposalTypeForGovPublicProposals(a);
  const bType = getProposalTypeForGovPublicProposals(b);
  if (!aType || !bType) return 0;
  if (aType === bType) {
    return 0;
  }
  return proposalTypeOrder[aType] - proposalTypeOrder[bType];
};

export default function GovernanceProposal({
  setSelectedProposalId,
  cosmWasmClient,
}: Props) {
  const { setSelectedDaoProposalTitle } = useAppState();
  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const { data, isLoading, isFetching, pagination } = useGovernanceProposals({
    governanceQueryClient,
    status: 'active',
  });

  const sorted = useMemo(() => {
    if (!data) return [];
    return data.proposals.sort(sortProposalsByType);
  }, [data]);

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      <GovernanceProposalComponent
        setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
        governanceQueryClient={governanceQueryClient}
        setSelectedProposalId={setSelectedProposalId}
        supply={supply as number}
        pagination={pagination}
        proposalTitle={'ACTIVE PROPOSALS'}
        data={sorted}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </>
  );
}

export const ArchivedGovernanceProposal = ({
  setSelectedProposalId,
  cosmWasmClient,
}: Props) => {
  const { setSelectedDaoProposalTitle } = useAppState();
  const [tabIndex, setTabIndex] = useState<number>(0);

  const { supply } = useCoinSupplyContext();
  const governanceQueryClient = new GovernanceQueryClient(
    cosmWasmClient as CosmWasmClient,
    NEXT_PUBLIC_GOVERNANCE_CONTRACT,
  );

  const {
    data: expiredConcludedData,
    isLoading: expiredConcludedLoading,
    isFetching: expiredConcludedFetching,
    pagination: expiredConcludedPagination,
  } = useGovernanceProposals({
    governanceQueryClient,
    status: 'expired_concluded',
  });

  const {
    data: successData,
    isLoading: successLoading,
    isFetching: successFetching,
    pagination: successPagination,
  } = useGovernanceProposals({
    governanceQueryClient,
    status: 'success_concluded',
  });

  const expiredConcludedSorted = useMemo(() => {
    if (!expiredConcludedData) {
      return [];
    }
    return expiredConcludedData.proposals.sort(sortProposalsByType);
  }, [expiredConcludedData]);

  const successSorted = useMemo(() => {
    if (!successData) {
      return [];
    }
    return successData.proposals.sort(sortProposalsByType);
  }, [successData]);

  return (
    <>
      <Flex height={'35px'} />
      <GovHeader />
      <Flex height={'46px'} />
      <Tabs
        variant="unstyled"
        marginTop="41px"
        padding="0 30px"
        index={tabIndex}
        onChange={setTabIndex}
      >
        <TabList>
          <Tab padding="0 0 10px" opacity={0.5} _selected={{ opacity: '1' }}>
            <Text
              color="lilac"
              fontFamily={'DM Sans'}
              fontWeight="500"
              fontSize={16}
            >
              Success
            </Text>
          </Tab>
          <Tab
            padding="0 0 10px"
            marginLeft="40px"
            opacity={0.5}
            _selected={{ opacity: '1' }}
          >
            <Text
              color="lilac"
              fontFamily={'DM Sans'}
              fontWeight="500"
              fontSize={16}
            >
              Expired
            </Text>
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="white"
          borderRadius="1px"
          width="80%"
        />
        <TabPanels>
          <TabPanel padding={0}>
            <GovernanceProposalComponent
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              governanceQueryClient={governanceQueryClient}
              setSelectedProposalId={setSelectedProposalId}
              supply={supply as number}
              pagination={successPagination}
              proposalTitle={'ACTIVE PROPOSALS'}
              data={successSorted}
              isLoading={successLoading}
              isFetching={successFetching}
            />
          </TabPanel>
          <TabPanel padding={0}>
            <GovernanceProposalComponent
              setSelectedDaoProposalTitle={setSelectedDaoProposalTitle}
              governanceQueryClient={governanceQueryClient}
              setSelectedProposalId={setSelectedProposalId}
              supply={supply as number}
              pagination={expiredConcludedPagination}
              proposalTitle={'ACTIVE PROPOSALS'}
              data={expiredConcludedSorted}
              isLoading={expiredConcludedLoading}
              isFetching={expiredConcludedFetching}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
