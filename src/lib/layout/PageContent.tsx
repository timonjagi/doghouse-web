import { Flex } from '@chakra-ui/react';
import React from 'react';

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify='center' p='16px 8px'>
      <Flex justify='center' width='95%' maxWidth='860'>
        {/* LHS  */}
        <Flex
          direction='column'
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0]}
        </Flex>
        {/* RHS */}
        <Flex
          direction='column'
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
        >
          {children && children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
