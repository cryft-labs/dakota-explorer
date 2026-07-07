// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { LinkExternalIcon } from 'src/toolkit/chakra/link';

import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';

interface Props {
  href: string;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestIpfsGateway = ({ href, searchTerm, onClick }: Props) => {
  return (
    <SearchBarSuggestItemLink
      href={ href }
      external
      noIcon
      onClick={ onClick }
      px={{ base: 3, lg: 4 }}
      py={ 4 }
      borderWidth="1px"
      borderRadius="base"
      bgColor={{ _light: 'white', _dark: 'dialog.bg' }}
      _hover={{
        bgColor: { _light: '#E6F7F3', _dark: '#113B32' },
        borderColor: 'hover',
      }}
      aria-label="Open IPFS CID in IPFS gateway"
    >
      <Flex
        gap={ 3 }
        alignItems={{ base: 'stretch', lg: 'center' }}
        justifyContent="space-between"
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Box minW={ 0 }>
          <Text fontWeight={ 700 } color="text.primary">
            IPFS CID detected
          </Text>
          <Text color="text.secondary" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            { searchTerm }
          </Text>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={ 2 }
          px={ 3 }
          py={ 2 }
          borderRadius="full"
          borderWidth="1px"
          borderColor="button.outline.fg"
          color="button.outline.fg"
          fontWeight={ 700 }
          whiteSpace="nowrap"
          flexShrink={ 0 }
        >
          <span>Open IPFS gateway</span>
          <LinkExternalIcon color="currentColor"/>
        </Flex>
      </Flex>
    </SearchBarSuggestItemLink>
  );
};

export default React.memo(SearchBarSuggestIpfsGateway);
