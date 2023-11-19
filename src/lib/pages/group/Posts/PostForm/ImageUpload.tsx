import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
  selectedFile: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (tabTitle: string) => void;
  setSelectedFile: (file: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onChange,
  setSelectedTab,
  setSelectedFile,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify='center' align='center' width='100%'>
      <Flex
        align='center'
        justify='center'
        direction='column'
        padding={20}
        border='1px dashed'
        borderColor='gray.200'
        borderRadius={4}
        width='100%'
      >
        {selectedFile ? (
          <>
            <Image
              width='100%'
              height='100%'
              maxWidth='400px'
              maxHeight='400px'
              src={selectedFile}
              alt={selectedFile.name}
            />
            <Stack direction='row' mt={4}>
              <Button height='28px' onClick={() => setSelectedTab('Post')}>
                Back to Post
              </Button>

              <Button
                variant='outline'
                height='28px'
                onClick={() => setSelectedFile('')}
              >
                Remove
              </Button>
            </Stack>
          </>
        ) : (
          <Button
            variant='outline'
            height='28px'
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
        )}

        <input
          ref={selectedFileRef}
          type='file'
          hidden
          onChange={onChange}
        ></input>
      </Flex>
    </Flex>
  );
};
export default ImageUpload;
